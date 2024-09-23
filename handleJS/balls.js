class Balls {
  constructor(image, x, y, vx, vy, size, type, restitution = 0.8) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.mass = size / 10;
    this.type = type;
    this.isFalling = false;
    this.angle = 0;
    this.restitution = restitution;
    this.image = new Image();
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
    this.image.src = image;
  }
  draw(context) {
    if (this.imageLoaded) {
      context.save();
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.translate(this.x + this.size / 2, this.y + this.size / 2);
      context.rotate(this.angle);
      context.drawImage(
        this.image,
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      );
      context.restore();
    } else {
      console.log("Đang load image: ", this.image.src);
    }
  }
  update(context, deltaTime) {
    if (this.isFalling) {
      this.x += this.vx;
      this.y += this.vy;
      this.vx += gravity[0];
      this.vy -= gravity[1];
      if (this.x > canvas.width - this.size) {
        this.x = canvas.width - this.size;
        this.vx *= -0.4;
      } else if (this.x < 0) {
        this.x = 0;
        this.vx *= -0.4;
      }
      if (this.y > canvas.height - this.size) {
        this.y = canvas.height - this.size;
        this.vy *= -0.4;
      }
      this.draw(context);
    } else {
      if (this.x > canvas.width - this.size) {
        this.x = canvas.width - this.size;
      } else if (this.x < 0) {
        this.x = 0;
      }
      if (this.y > canvas.height - this.size) {
        this.y = canvas.height - this.size;
      }
      this.draw(context);
    }
  }
}
