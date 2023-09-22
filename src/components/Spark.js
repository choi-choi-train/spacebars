class Spark {
    constructor(startX, startY, context) {
        this.x = startX;
        this.y = startY;
        this.ctx = context;
        this.velX = Math.random() * 8 - 4;
        this.velY = Math.random() * 8 - 4;
        this.size = Math.random() * 2 + 1;
    }
    
    update() {
        this.x += this.velX;
        this.y += this.velY;

        this.velX = this.velX * 0.9;
        this.velY += 0.05;
        
        if (this.size > 0.2) {
            this.size -= 0.05
        }
    }

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

export default Spark;