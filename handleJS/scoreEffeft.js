class ScoreEffect {
  constructor(x, y, score, lifetime = 1000) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.lifetime = lifetime;
    this.elapsedTime = 0;
    this.opacity = 1;
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime * 1000;
    this.y -= 1;
    this.opacity = 1 - this.elapsedTime / this.lifetime;
  }

  draw(context) {
    context.save();
    context.globalAlpha = this.opacity;
    context.fillStyle = "yellow";
    context.font = "20px Arial";
    context.fillText(`+${this.score}`, this.x, this.y);
    context.restore();
  }

  isFinished() {
    return this.elapsedTime >= this.lifetime;
  }
}
