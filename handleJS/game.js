const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const score = document.getElementById("score");
const returnMenuBtn = document.getElementById("returnMenu");

canvas.width = 400;
canvas.height = 500;
const vx = 0;
const vy = 8;
const restitution = 0.9;
const posDefault = [canvas.width / 2, 70];
const gravity = [0, -0.1];
let count = 0;
const timeDefault = 60;
let gameTime = 2;
const condition = 2;
let gameInterval;
let checkWin = false;
let backToMenuButton;

let currentBall = null;
const W = canvas.width;
const H = canvas.height;
let startGame = false;
let isMenuActive = true;
let isGameOver = false;

let gameMenu = new GameMenu(canvas, context);

const balls = [
  {
    name: "ball0",
    type: 0,
    size: 30,
  },
  {
    name: "ball1",
    type: 1,
    size: 40,
  },
  {
    name: "ball2",
    type: 2,
    size: 50,
  },
  {
    name: "ball3",
    type: 3,
    size: 60,
  },
  {
    name: "ball4",
    type: 4,
    size: 70,
  },
  {
    name: "ball5",
    type: 5,
    size: 80,
  },
  {
    name: "ball6",
    type: 6,
    size: 90,
  },
  {
    name: "ball7",
    type: 7,
    size: 100,
  },
  {
    name: "ball8",
    type: 8,
    size: 110,
  },
  {
    name: "ball9",
    type: 9,
    size: 120,
  },
];
let scoreEffects = [];
const ballPosDefault = [];
let arrayBallGames = [];

function loadBalls() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    ball.imageUrl = `../assets/img/balls/${i}.png`;
  }
}

function randomBallAtPosDefault() {
  let random = Math.floor(Math.random() * 4);
  const { imageUrl, name, size, type } = balls[random];
  let newBall = new Balls(
    imageUrl,
    posDefault[0],
    posDefault[1],
    vx,
    0,
    size,
    type
  );
  currentBall = newBall;
  ballPosDefault.push(newBall);
}

function checkCollision(ballA, ballB) {
  var rSum = ballA.size / 2 + ballB.size / 2;
  var dx = ballB.x - ballA.x;
  var dy = ballB.y - ballA.y;
  return [rSum * rSum > dx * dx + dy * dy, rSum - Math.sqrt(dx * dx + dy * dy)];
}

function resolveCollision(ballA, ballB) {
  // var relVel = [ballB.vx - ballA.vx, ballB.vy - ballA.vy];
  // var norm = [ballB.x - ballA.x, ballB.y - ballA.y];
  // var mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
  // const angleBetween = Math.atan2(norm[1], norm[0]);
  // norm = [norm[0] / mag, norm[1] / mag];

  // var velAlongNorm = relVel[0] * norm[0] + relVel[1] * norm[1];
  // if (velAlongNorm > 0) return;

  // var bounce = 0.7;
  // var j = -(1 + bounce) * velAlongNorm;
  // j /= 1 / (ballA.size / 2) + 1 / (ballB.size / 2);

  // var impulse = [j * norm[0], j * norm[1]];
  // ballA.vx -= (1 / (ballA.size / 2)) * impulse[0];
  // ballA.vy -= (1 / (ballA.size / 2)) * impulse[1];
  // ballB.vx += (1 / (ballB.size / 2)) * impulse[0];
  // ballB.vy += (1 / (ballB.size / 2)) * impulse[1];
  const relVel = [ballB.vx - ballA.vx, ballB.vy - ballA.vy];
  const norm = [ballB.x - ballA.x, ballB.y - ballA.y];
  const mag = Math.sqrt(norm[0] ** 2 + norm[1] ** 2);
  const angleBetween = Math.atan2(norm[1], norm[0]);
  const normalizedNorm = [norm[0] / mag, norm[1] / mag];

  const velAlongNorm =
    relVel[0] * normalizedNorm[0] + relVel[1] * normalizedNorm[1];
  if (velAlongNorm > 0) return;

  const bounce = 0.7;
  const j = -(1 + bounce) * velAlongNorm;
  const massSum = 1 / (1 / ballA.mass + 1 / ballB.mass);
  const impulse = [
    j * normalizedNorm[0] * massSum,
    j * normalizedNorm[1] * massSum,
  ];

  ballA.vx -= (1 / ballA.mass) * impulse[0];
  ballA.vy -= (1 / ballA.mass) * impulse[1];
  ballB.vx += (1 / ballB.mass) * impulse[0];
  ballB.vy += (1 / ballB.mass) * impulse[1];

  //rotate ball
  // ballA.angle -= angleBetween + Math.PI / 2;
  // ballB.angle += angleBetween - Math.PI / 2;
}

function adjustPositions(ballA, ballB, deep, check) {
  const percent = 0.02;
  const slop = 0.01;
  if (!check) return;
  var correction =
    (Math.max(deep - slop, 0) / (1 / (ballA.size / 2) + 1 / (ballB.size / 2))) *
    percent;

  var norm = [ballB.x - ballA.x, ballB.y - ballA.y];
  var mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
  if (mag === 0) return;
  norm = [norm[0] / mag, norm[1] / mag];
  correction = [correction * norm[0], correction * norm[1]];

  ballA.x -= (1 / (ballA.size / 2)) * correction[0];
  ballA.y -= (1 / (ballA.size / 2)) * correction[1];
  ballB.x += (1 / (ballB.size / 2)) * correction[0];
  ballB.y += (1 / (ballB.size / 2)) * correction[1];
}

function posFallClick(x) {
  currentBall.vy = vy;
  currentBall.vx = Math.random() * 2 - 1;
  currentBall.isFalling = true;
  arrayBallGames.push(currentBall);
  currentBall = null;
  ballPosDefault.forEach((item, _index) => {
    ballPosDefault.splice(_index, 1);
  });
  // ballPosDefault.length = 0;
  randomBallAtPosDefault();
}
if (!isGameOver) {
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (currentBall && !currentBall.isFalling) {
      posDefault[0] = x;
      currentBall.x = posDefault[0];
    }
  });
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (currentBall) {
      posFallClick(x);
    }
  });
}
canvas.addEventListener("click", () => {
  if (!startGame) {
    startGame = true;
    isMenuActive = false;
    startTimer();
  }
});
function startTimer() {
  gameInterval = setInterval(() => {
    gameTime--;
    if (gameTime <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
}
function endGame() {
  isGameOver = true;
  startGame = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "24px Arial";
  if (checkWin) {
    console.log(true);
    context.fillText("Chiến thắng!", canvas.width / 2, canvas.height / 2);
    context.fillText(
      `Thời gian hợp nhất bóng: ${(timeDefault - gameTime).toFixed(2)}s`,
      canvas.width / 2,
      canvas.height / 2 + 30
    );
  } else {
    context.fillText(
      `Hết thời gian! Không hoàn thành.`,
      canvas.width / 2,
      canvas.height / 2
    );
  }
  createBackToMenuButton();
}
function createBackToMenuButton() {
  backToMenuButton = {
    x: canvas.width / 2 - 75,
    y: canvas.height / 2 + 70,
    width: 150,
    height: 40,
    draw() {
      context.fillStyle = "blue";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "white";
      context.font = "20px Arial";
      context.fillText("Back to Menu", this.x + 10, this.y + 25);
    },
    isHovered(mouseX, mouseY) {
      return (
        mouseX > this.x &&
        mouseX < this.x + this.width &&
        mouseY > this.y &&
        mouseY < this.y + this.height
      );
    },
  };

  canvas.addEventListener("click", handleBackToMenu);
}
function resetGame() {
  gameTime = 2;
  count = 0;
  checkWin = false;
  isGameOver = false;
  arrayBallGames = [];
  scoreEffects = [];
  startGame = false;
  isMenuActive = true;
  currentBall = null;

  canvas.removeEventListener("click", handleBackToMenu);
}
function drawTimeAndScore() {
  context.fillStyle = "white";
  context.font = "24px Arial";
  context.fillText(`Time: ${gameTime}s`, canvas.width / 2 - 125, 30);
  context.fillText(`Total: ${count}`, canvas.width / 2 + 120, 30);
}
function mergeBalls(ball1, ball2) {
  let nextBall = ball1.type + 1;
  const index1 = arrayBallGames.indexOf(ball1);
  const index2 = arrayBallGames.indexOf(ball2);
  if (index1 > index2) {
    arrayBallGames.splice(index1, 1);
    arrayBallGames.splice(index2, 1);
  } else {
    arrayBallGames.splice(index2, 1);
    arrayBallGames.splice(index1, 1);
  }
  const { imageUrl, name, size, type } = balls[nextBall];
  const mergedBall = new Balls(
    imageUrl,
    (ball1.x + ball2.x) / 2,
    (ball1.y + ball2.y) / 2 - 50,
    vx,
    vy,
    size,
    type
  );
  if (Number.isInteger(nextBall)) {
    count += nextBall * 10;
    const effect = new ScoreEffect(
      (ball1.x + ball2.x) / 2,
      (ball1.y + ball2.y) / 2,
      nextBall * 10
    );
    scoreEffects.push(effect);
  }
  if (mergedBall.type === condition) {
    checkWin = true;
    isGameOver = true;
    clearInterval(gameInterval);
    endGame();
  }
  mergedBall.isFalling = true;
  arrayBallGames.push(mergedBall);
}
let secondsPassed = 0;
let oldTimeStamp = 0;
function gameLoop(timeStamp) {
  if (!gameMenu.startGame) {
    gameMenu.update();
  } else {
    if (!isGameOver) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    scoreEffects.forEach((effect, index) => {
      effect.update(secondsPassed);
      effect.draw(context);
      if (effect.isFinished()) {
        scoreEffects.splice(index, 1);
      }
    });
    if (startGame && gameTime > 0) {
      ballPosDefault.forEach((item, _index) => {
        item.update(context, secondsPassed);
      });
      for (let i = 0; i < arrayBallGames.length; i++) {
        for (let j = i + 1; j < arrayBallGames.length; j++) {
          var collision = checkCollision(arrayBallGames[i], arrayBallGames[j]);
          if (collision[0]) {
            resolveCollision(arrayBallGames[i], arrayBallGames[j]);
            adjustPositions(
              arrayBallGames[i],
              arrayBallGames[j],
              collision[1],
              collision[0]
            );
            if (arrayBallGames[i].type === arrayBallGames[j].type) {
              mergeBalls(arrayBallGames[i], arrayBallGames[j]);
            }
          }
        }
      }
      arrayBallGames.forEach((item, _index) => {
        item.update(context, secondsPassed);
      });
      drawTimeAndScore();
    } else if (gameTime <= 0 && !isGameOver) {
      backToMenuButton.draw();
      isGameOver = true;
      clearInterval(gameInterval);
      endGame();
    }
  }
  if (gameTime > 0 && !isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}
loadBalls();
gameLoop(0);
requestAnimationFrame(gameLoop);
