document.addEventListener('DOMContentLoaded', () => {
    // === Core Elements ===
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const modal = document.querySelector('.modal');
    const modalText = document.getElementById('winner-text');
    const modalResetBtn = document.getElementById('modal-reset-btn');

    // === Game State ===
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];

    // === Initialization ===
    fetchState();

    // Create Confetti Container if it doesn't exist
    let confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        document.body.appendChild(confettiContainer);
    }

    // === API Functions === //
    function fetchState() {
        fetch('/api/state')
            .then(res => res.json())
            .then(data => updateUI(data))
            .catch(err => console.error('Error fetching state:', err));
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (gameState[index] !== "" || !gameActive) {
            return;
        }

        // Optimistic UI update
        updateCell(index, currentPlayer);

        // 1. Send move to server
        fetch('/api/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: index }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    fetchState(); // Revert
                } else {
                    updateUI(data);
                }
            })
            .catch(err => console.error('Error making move:', err));
    }

    // === UI Logic === //
    function updateUI(data) {
        gameState = data.board;
        currentPlayer = data.turn;

        // Check if game just ended
        const prevGameActive = gameActive;
        gameActive = !data.winner && !data.draw;

        cells.forEach((cell, i) => {
            cell.innerText = gameState[i];
            cell.className = 'cell'; // Reset classes
            if (gameState[i] === 'X') {
                cell.classList.add('x');
                cell.setAttribute('data-content', 'X'); // For CSS
            }
            if (gameState[i] === 'O') {
                cell.classList.add('o');
                cell.setAttribute('data-content', 'O'); // For CSS
            }
        });

        if (data.winner) {
            statusText.innerHTML = `<span class="player-${data.winner.toLowerCase()}">Player ${data.winner} Wins!</span>`;
            showModal(`Player ${data.winner} Wins!`, true);
        } else if (data.draw) {
            statusText.innerText = `It's a Draw!`;
            showModal(`It's a Draw!`, false);
        } else {
            statusText.innerHTML = `Current Turn: <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>`;
        }
    }

    function updateCell(index, player) {
        gameState[index] = player;
        const cell = cells[index];
        cell.innerText = player;
        cell.classList.add(player.toLowerCase());

        // Add a small pop animation class momentarily? 
        // CSS animation handles the entry.
    }

    function resetGame() {
        // Clear effects
        confettiContainer.innerHTML = '';

        fetch('/api/reset', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                updateUI(data);
                hideModal();
            });
    }

    function showModal(message, isWin) {
        modalText.innerText = message;
        modal.classList.add('visible');

        if (isWin) {
            triggerConfetti();
        }
    }

    function hideModal() {
        modal.classList.remove('visible');
        confettiContainer.innerHTML = ''; // Stop confetti
    }

    // === Animation Logic (Confetti) === //
    function triggerConfetti() {
        // Create 50 particles
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('confetti');

        // Random properties
        const x = Math.random() * window.innerWidth;
        const delay = Math.random() * 2; // s
        const duration = 2 + Math.random() * 3; // s
        const color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Neon colors

        particle.style.left = `${x}px`;
        particle.style.top = `-10px`;
        particle.style.backgroundColor = color;
        particle.style.animation = `fall ${duration}s linear ${delay}s infinite`;

        // Add Dynamic CSS Keyframe for falling if needed, or simple style manipulation
        // For simplicity, let's just animate via JS or assume CSS exists.
        // Actually, let's insert a style for this specific fall

        particle.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity
        });

        confettiContainer.appendChild(particle);
    }

    // === Listeners === //
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    modalResetBtn.addEventListener('click', resetGame);
});
