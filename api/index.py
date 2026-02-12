from flask import Flask, render_template, jsonify, request, session
import os

# Initialize Flask app
# template_folder 'templates' means api/templates relative to api/index.py
app = Flask(__name__, template_folder='templates', static_folder='../static')
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_123') # flexible for dev/prod

# Game Logic Helper
def check_winner(board, player):
    # Winning combinations
    win_conditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], # Cols
        [0, 4, 8], [2, 4, 6]             # Diagonals
    ]
    
    for condition in win_conditions:
        if all(board[i] == player for i in condition):
            return True
    return False

def is_board_full(board):
    return "" not in board

@app.route('/')
def home():
    if 'board' not in session:
        reset_game_state()
    return render_template('index.html')

@app.route('/api/state', methods=['GET'])
def get_state():
    if 'board' not in session:
        reset_game_state()
    return jsonify(session)

@app.route('/api/move', methods=['POST'])
def make_move():
    data = request.json
    index = data.get('index')
    
    if index is None:
        return jsonify({'error': 'No index provided'}), 400
        
    index = int(index)
    
    board = session.get('board')
    turn = session.get('turn')
    winner = session.get('winner')
    
    if winner or board[index] != "":
        return jsonify({'error': 'Invalid move'}), 400
        
    # Update board
    board[index] = turn
    
    # Check for win or draw
    if check_winner(board, turn):
        session['winner'] = turn
    elif is_board_full(board):
        session['draw'] = True
    else:
        # Switch turn
        session['turn'] = 'O' if turn == 'X' else 'X'
        
    session['board'] = board # Save back to session
    
    return jsonify(session)

@app.route('/api/reset', methods=['POST'])
def reset():
    reset_game_state()
    return jsonify(session)

def reset_game_state():
    session['board'] = [""] * 9
    session['turn'] = 'X'
    session['winner'] = None
    session['draw'] = False

# This is required for Vercel
app.debug = True

if __name__ == '__main__':
    app.run()
