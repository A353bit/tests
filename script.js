const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const paddleWidth = 16;
const paddleHeight = 100;
const ballRadius = 12;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Velocità base
const baseSpeedX = 5;
const baseSpeedY = 4;

// Paddle positions
let leftPaddleY = (canvasHeight - paddleHeight) / 2;
let rightPaddleY = (canvasHeight - paddleHeight) / 2;

// Ball position and velocity
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = baseSpeedX * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = baseSpeedY * (Math.random() * 2 - 1);

// Mouse control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight / 2;

    leftPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftPaddleY));
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvasHeight; i += 30) {
        ctx.fillRect(canvasWidth / 2 - 2, i, 4, 20);
    }
}

// AI paddle
function moveAIPaddle() {
    const paddleCenter = rightPaddleY + paddleHeight / 2;

    if (paddleCenter < ballY - 20) {
        rightPaddleY += 5;
    } else if (paddleCenter > ballY + 20) {
        rightPaddleY -= 5;
    }

    rightPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, rightPaddleY));
}

// Collision
function collision(x, y, paddleX, paddleY, paddleW, paddleH) {
    return (
        x + ballRadius > paddleX &&
        x - ballRadius < paddleX + paddleW &&
        y + ballRadius > paddleY &&
        y - ballRadius < paddleY + paddleH
    );
}

// Reset ball
function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;

    ballSpeedX = baseSpeedX * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = baseSpeedY * (Math.random() * 2 - 1);
}

// Update (con sub-steps per alta velocità)
function update() {
    let steps = Math.ceil(Math.max(Math.abs(ballSpeedX), Math.abs(ballSpeedY)));

    for (let i = 0; i < steps; i++) {
        let stepX = ballSpeedX / steps;
        let stepY = ballSpeedY / steps;

        ballX += stepX;
        ballY += stepY;

        // Collisione muri
        if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
            ballSpeedY = -ballSpeedY;
        }

        // LEFT paddle
        if (collision(ballX, ballY, 0, leftPaddleY, paddleWidth, paddleHeight)) {
            ballSpeedX = Math.abs(ballSpeedX);

            const collidePoint = (ballY - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = collidePoint * 5;

            // aumento velocità
            ballSpeedX *= 1.1;
            ballSpeedY *= 1.1;

            break;
        }

        // RIGHT paddle
        if (collision(ballX, ballY, canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight)) {
            ballSpeedX = -Math.abs(ballSpeedX);

            const collidePoint = (ballY - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
            ballSpeedY = collidePoint * 5;

            // aumento velocità
            ballSpeedX *= 1.1;
            ballSpeedY *= 1.1;

            break;
        }

        // Punto (fuori campo)
        if (ballX - ballRadius < 0 || ballX + ballRadius > canvasWidth) {
            resetBall();
            break;
        }
    }

    moveAIPaddle();
}

// Render
function render() {
    drawRect(0, 0, canvasWidth, canvasHeight, "#111");
    drawNet();

    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "#00FF99");
    drawRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "#FF2052");

    drawCircle(ballX, ballY, ballRadius, "#FFD700");
}

// Loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

game();