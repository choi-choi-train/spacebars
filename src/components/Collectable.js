const PINK = 'rgba(255, 67, 101)'
const PURPLE = 'rgba(84, 13, 110)'
const YELLOW = 'rgba(249, 200, 14)';

class Collectable {
    constructor(canvasWidth, canvasHeight, context) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.canvWidth = canvasWidth;
        this.canvHeight = canvasHeight;
        this.ctx = context;
        this.velX = Math.random() * 2 - 1;
        this.velY = Math.random() * 2 - 1;
        this.velX = this.velX * 3;
        this.velY = this.velY * 3;
        this.size = 15;
        this.color = YELLOW;
        this.value = 100;

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

    getPos() {
        return {
            x: this.x,
            y: this.y
        }
    }
    relocate() {
        this.x = Math.random() * this.canvWidth;
        if (Math.abs(this.canvWidth/2 - this.x) < 100) {
            this.x = Math.random() * this.canvWidth;
        }
        this.y = Math.random() * this.canvHeight;
        if (Math.abs(this.canvHeight/2 - this.y) < 100) {
            this.y = Math.random() * this.canvHeight;
        }
        this.velX = Math.random() * 2 - 1;
        this.velY = Math.random() * 2 - 1;
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

export default Collectable;