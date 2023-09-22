const PINK = 'rgba(255, 67, 101)'
const YELLOW = 'rgba(249, 200, 14)';
const PURPLE = 'rgba(84, 13, 110)'

class Particle {
    constructor(canvasWidth, canvasHeight, context) {
        this.x = Math.random() * canvasWidth;
        if (Math.abs(canvasWidth/2 - this.x) < 100) {
            this.x = Math.random() * canvasWidth;
        }
        this.y = Math.random() * canvasHeight;
        if (Math.abs(canvasHeight/2 - this.y) < 100) {
            this.y = Math.random() * canvasHeight;
        }
        this.canvWidth = canvasWidth;
        this.canvHeight = canvasHeight;
        this.ctx = context;
        this.size = 3;
        this.velX = Math.random() * 1.6 - 0.8;
        this.velX = this.velX * ((canvasWidth / 1680 + canvasHeight/780)/2)
        this.velY = Math.random() * 1.6 - 0.8;
        this.velY = this.velY * ((canvasWidth / 1680 + canvasHeight/780)/2)
        this.color = 'white';
    }

    update() {
        this.x += this.velX;
        this.y += this.velY;

        if (this.x > this.canvWidth) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x = this.canvWidth;
        }
        if (this.y > this.canvHeight) {
            this.y = 0;
        }
        if (this.y < 0) {
            this.y = this.canvHeight;
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = PINK;
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

export default Particle;