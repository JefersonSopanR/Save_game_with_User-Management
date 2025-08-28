// Type definitions
interface LobbyRoom {
  roomId: string;
  players: number;
}

interface GameState {
  player1: Player;
  player2: Player;
  ball: Ball;
  gameEnded: boolean;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
}

interface PlayerAssignment {
  isPlayer1: boolean;
  roomId: string;
  message: string;
}

interface GameMessage {
  message: string;
}

interface GameEndData {
  winner: string;
  finalScore: string;
}

// Declare global io function
declare const io: any;

// Get authentication token
const token: string | null = localStorage.getItem('token');
const socket = io({ auth: { token } });

socket.on("lobbyUpdate", (rooms: LobbyRoom[]) => {
    const lobbyDiv = document.getElementById("lobby");
    if (!lobbyDiv) return;

    lobbyDiv.innerHTML = "<h3>Available Rooms:</h3>";
    if (rooms.length === 0) {
        lobbyDiv.innerHTML += "<p>No active rooms. Create one!</p>";
    } else {
        rooms.forEach((room: LobbyRoom) => {
            const btn = document.createElement("button");
            btn.textContent = `${room.roomId} (${room.players}/2)`;

            if (room.players >= 2) {
                btn.disabled = true; // show but disabled
                btn.style.opacity = "0.5";
            } else {
                btn.onclick = () => socket.emit("joinRoom", room.roomId);
            }

            lobbyDiv.appendChild(btn);
        });
    }

    const createBtn = document.createElement("button");
    createBtn.textContent = "➕ Create New Room";
    createBtn.onclick = () => socket.emit("joinRoom", null);
    lobbyDiv.appendChild(createBtn);
});


socket.on('connect_error', (err: Error) => {
    alert('Authentication required. Please log in.');
    window.location.href = '/login.html';
});

socket.on("gameEnded", (data: GameEndData) => {
    //alert(`Game Over! ${data.winner} wins with score: ${data.finalScore}`);
});

// ask players if they want to continue
socket.on("continuePrompt", (data: GameMessage) => {
    const modal = document.getElementById("continueModal") as HTMLDivElement;
    const message = document.getElementById("continueMessage") as HTMLParagraphElement;
    const yesBtn = document.getElementById("continueYes") as HTMLButtonElement;
    const noBtn = document.getElementById("continueNo") as HTMLButtonElement;

    if (!modal || !message || !yesBtn || !noBtn) return;

    message.textContent = data.message;
    modal.style.display = "flex";

    yesBtn.onclick = () => {
        socket.emit("continueVote", { roomId, vote: "yes" });
        modal.style.display = "none";
    };

    noBtn.onclick = () => {
        socket.emit("continueVote", { roomId, vote: "no" });
        modal.style.display = "none";
    };
});

// ✅ Close modal if the server says the game was closed
socket.on("gameClosed", (data: GameMessage) => {
    const modal = document.getElementById("continueModal") as HTMLDivElement;
    if (modal) modal.style.display = "none"; // hide modal if still open

    alert(data.message);
    // reset UI back to lobby, if you want
});

socket.on('playerDisconnected', (data: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = data.message;
    }
});

// extra disconnection/reconnection updates
socket.on("opponentDisconnected", (msg: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = msg.message;
    }
});

socket.on("opponentReconnected", (msg: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = msg.message;
    }
});


// Game canvas and context
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Game state
let gameState: GameState | null = null;
let isPlayer1: boolean = false;
let roomId: string | null = null;

// Socket event listeners
socket.on('playerAssignment', (data: PlayerAssignment) => {
    isPlayer1 = data.isPlayer1;
    roomId = data.roomId;
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = data.message;
    }
});

socket.on('gameReady', (data: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = data.message;
    }
});

socket.on('gameUpdate', (data: GameState) => {
    gameState = data;
    updateScore();
    draw();
});

socket.on('playerDisconnected', (data: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = data.message;
    }
});

socket.on('gameReset', (data: GameMessage) => {
    const playerInfoElement = document.getElementById('playerInfo');
    if (playerInfoElement) {
        playerInfoElement.textContent = data.message;
    }
});

// Mouse movement for paddle control
canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (!gameState || gameState.gameEnded) return; // Don't allow movement if game ended
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Send paddle position to server
    socket.emit('paddleMove', { y: mouseY - 50 }); // Center paddle on mouse
});

// Update score display
function updateScore(): void {
    if (gameState) {
        const score1Element = document.getElementById('score1');
        const score2Element = document.getElementById('score2');
        
        if (score1Element) {
            score1Element.textContent = gameState.player1.score.toString();
        }
        if (score2Element) {
            score2Element.textContent = gameState.player2.score.toString();
        }
    }
}

// Draw the game
function draw(): void {
    if (!gameState) return;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);
    ctx.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight current player's paddle
    if (isPlayer1) {
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 3;
        ctx.strokeRect(gameState.player1.x - 1, gameState.player1.y - 1, gameState.player1.width + 2, gameState.player1.height + 2);
    } else {
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 3;
        ctx.strokeRect(gameState.player2.x - 1, gameState.player2.y - 1, gameState.player2.width + 2, gameState.player2.height + 2);
    }
}
