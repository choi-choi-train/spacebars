const PINK = 'rgba(255, 67, 101)'
const YELLOW = 'rgba(249, 200, 14)';
const PURPLE = 'rgba(84, 13, 110)'

class Trail {
    constructor(startX, startY, context) {
        this.x = startX;
        this.y = startY;
        this.ctx = context;
        this.size = 4;
        this.color = 'white';
    }
    
    update() {
        if (this.size > 0.2) {
            this.size -= 0.15;
        }
        if (this.size < 3) {
            this.color = YELLOW;
        }
        if (this.size < 2) {
            this.color = PINK;
        }
        if (this.size < 1.5) {
            this.color = PURPLE;
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

export default Trail;