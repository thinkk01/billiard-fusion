class GameMenu {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.buttons = {
      start: { x: 150, y: 200, width: 100, height: 40 },
      help: { x: 150, y: 260, width: 100, height: 40 },
      exit: { x: 150, y: 320, width: 100, height: 40 },
      backToMenu: { x: 150, y: 380, width: 100, height: 40 },
    };
    this.init();
  }

  init() {
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
  }
  drawArcText(text, centerX, centerY, radius, startAngle, endAngle) {
    this.context.save();
    this.context.font = "42px Dancing Script";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";

    let angleStep = (endAngle - startAngle) / text.length;

    for (let i = 0; i < text.length; i++) {
      let angle = startAngle + i * angleStep;
      let charX = centerX + radius * Math.cos(angle);
      let charY = centerY + radius * Math.sin(angle);

      this.context.save();
      this.context.translate(charX, charY);
      this.context.rotate(angle + Math.PI / 2);
      this.context.fillText(text[i], 0, 0);
      this.context.restore();
    }

    this.context.restore();
  }
  drawEndGame() {
    this.context.fillStyle = "#282c34";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "white";
    this.context.font = "30px Arial";
    this.context.textAlign = "center";
    this.context.fillText(
      "Game Over",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );
    this.drawButton("Back to Menu", this.buttons.backToMenu);
  }
  draw() {
    this.context.fillStyle = "#282c34";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArcText(
      "Billiards Fusion",
      this.canvas.width / 2,
      250,
      130,
      -Math.PI,
      Math.PI / 14
    );

    this.drawButton("Start Game", this.buttons.start);
    this.drawButton("Help", this.buttons.help);
    this.drawButton("Exit", this.buttons.exit);
  }

  drawButton(text, button) {
    this.context.fillStyle = "white";
    this.context.fillRect(button.x, button.y, button.width, button.height);
    this.context.fillStyle = "#282c34";
    this.context.font = "16px Arial";
    this.context.textAlign = "center";
    this.context.fillText(
      text,
      button.x + button.width / 2,
      button.y + button.height / 1.5
    );
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (!this.startGame && !this.showHelp) {
      if (this.isInsideButton(mouseX, mouseY, this.buttons.start)) {
        this.startGame = true;
        randomBallAtPosDefault();
        console.log("Game started");
      } else if (this.isInsideButton(mouseX, mouseY, this.buttons.help)) {
        this.showHelp = true;
        console.log("Show help");
      } else if (this.isInsideButton(mouseX, mouseY, this.buttons.exit)) {
        console.log("Exit game");
        window.close();
      }
    } else if (this.showHelp) {
      this.showHelp = false;
    }
  }

  isInsideButton(mouseX, mouseY, button) {
    return (
      mouseX >= button.x &&
      mouseX <= button.x + button.width &&
      mouseY >= button.y &&
      mouseY <= button.y + button.height
    );
  }

  drawHelp() {
    this.context.fillStyle = "#282c34";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "white";
    this.context.font = "20px Arial";
    this.context.textAlign = "center";
    this.context.fillText(
      "Hợp thể các bóng cùng số với nhau",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.context.fillText(
      "--Click bất kì để trở lại Menu Game--",
      this.canvas.width / 2,
      this.canvas.height / 2 + 100
    );
  }

  update() {
    if (!this.startGame && !this.showHelp && !this.showEndGame) {
      this.draw();
    } else if (this.showHelp) {
      this.drawHelp();
    } else if (this.showEndGame) {
      this.drawEndGame();
    }
  }
}
