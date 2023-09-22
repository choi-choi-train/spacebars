class UIText {
    constructor(xPos, yPos, value, context) {
        this.x = xPos;
        this.y = yPos;
        this.yChange = 0;
        this.ctx = context;
        this.value = value;
        this.velX = Math.random() * 1 - 0.5;
        this.velY = Math.random() * 1 - 0.5;

        this.onehundred = new Image();
        this.onehundred.src = require('../assets/100.png');
        this.combo = new Image();
        this.combo.src = require('../assets/combo.png');

        if (value === 100) {
            this.sprite = this.onehundred;
        }
        if (value === 'combo') {
            this.sprite = this.combo;
        }
    }

    update() {
        if (this.value === 'combo') {
            this.x += this.velX;
            this.y += this.velY;
        } else {
            this.y -= 0.2;
        }
        this.yChange += 0.1;
    }

    getYChange() {
        return this.yChange;
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
        this.ctx.shadowBlur = 0;
        if (this.value === 'combo') {
            this.ctx.drawImage(this.sprite, this.x - 30, this.y - 10, 60, 20);
        } else {
            this.ctx.drawImage(this.sprite, this.x - 30, this.y - 15, 60, 30);
        }
    }
}

export default UIText;