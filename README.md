# Tic-Tac-Toe Game (Flask + Vercel)

A clean, modern implementation of the classic Tic-Tac-Toe game using Python (Flask) for the backend logic and vanilla HTML/CSS/JS for the frontend.

## Features
- **Backend Logic**: Game state and move validation handled by Python.
- **Session Management**: Uses secure client-side sessions to maintain game state without a database.
- **Responsive UI**: Sleek dark mode design.
- **Serverless Ready**: Configured for Vercel deployment.

## Project Structure
```
/api
    /templates
        index.html  # Game interface
    index.py        # Flask application entry point
/static
    style.css       # Styling
    script.js       # Frontend logic
vercel.json         # Vercel configuration
requirements.txt    # Python dependencies
```

## How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/khushiiikk/tic-tac-toe.git
    cd tic-tac-toe
    ```

2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application**:
    ```bash
    python api/index.py
    ```
    Open `http://127.0.0.1:5000` in your browser.

## Deployment to Vercel

1.  Push your code to GitHub.
2.  Import the repository in Vercel.
3.  Vercel will automatically detect `api/index.py` and `vercel.json`.
4.  Deploy!

