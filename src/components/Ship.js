const PINK = 'rgba(255, 67, 101)'
const YELLOW = 'rgba(249, 200, 14)';
const PURPLE = 'rgba(84, 13, 110)'

class Ship {
    constructor(startX, startY, context, canvasWidth, canvasHeight) {
        this.x = startX;
        this.y = startY;
        this.canvWidth = canvasWidth;
        this.canvHeight = canvasHeight;
        this.velX = 0;
        this.velY = 0;
        this.ctx = context;
        this.speed = 1 + (0.6 * (canvasWidth / 1680 + canvasHeight/780)/2);
        this.size = 60

        this.health = 0;
        localStorage.setItem('health', this.health);

        this.s_up = new Image();
        this.s_up.src = require('../assets/shipup.png');
        this.s_left = new Image();
        this.s_left.src = require('../assets/shipleft.png');
        this.s_right = new Image();
        this.s_right.src = require('../assets/shipright.png');
        this.s_down = new Image();
        this.s_down.src = require('../assets/shipdown.png');
        this.s_upleft = new Image();
        this.s_upleft.src = require('../assets/shipupleft.png');
        this.s_upright = new Image();
        this.s_upright.src = require('../assets/shipupright.png');
        this.s_downleft = new Image();
        this.s_downleft.src = require('../assets/shipdownleft.png');
        this.s_downright = new Image();
        this.s_downright.src = require('../assets/shipdownright.png');

        this.sprite = this.s_up;

        this.streak = 0;
    }

    update() {
        // MOVEMENT
        this.x += Math.round(this.velX * 10) / 10;
        this.y += Math.round(this.velY * 10) / 10;

        this.velX = this.velX * 0.75
        this.velY = this.velY * 0.75

        // WRAP
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

    accelerate(keysDown) {
        const lefting = keysDown['a'] === true || keysDown['ArrowLeft'] === true;
        const righting = keysDown['d'] === true || keysDown['ArrowRight'] === true;
        const upping = keysDown['w'] === true || keysDown['ArrowUp'] === true;
        const downing = keysDown['s'] === true || keysDown['ArrowDown'] === true;

        if (downing) {
            if (righting || lefting) {
                this.velY += this.speed / Math.sqrt(2);
            } else {
                this.velY += this.speed; 
            }
        }
        if (righting) {
            if (downing || upping) {
                this.velX += this.speed / Math.sqrt(2);
            } else {
                this.velX += this.speed; 
            }
        }
        if (upping) {
            if (righting || lefting) {
                this.velY -= this.speed / Math.sqrt(2);
            } else {
                this.velY -= this.speed; 
            }
        }
        if (lefting) {
            if (downing || upping) {
                this.velX -= this.speed / Math.sqrt(2);
            } else {
                this.velX -= this.speed; 
            }
        }
   }

    handleSprites(keysDown) {
        const lefting = keysDown['a'] === true || keysDown['ArrowLeft'] === true;
        const righting = keysDown['d'] === true || keysDown['ArrowRight'] === true;
        const upping = keysDown['w'] === true || keysDown['ArrowUp'] === true;
        const downing = keysDown['s'] === true || keysDown['ArrowDown'] === true;

        if (downing) {
            this.sprite = this.s_down;
        }
        if (righting) {
            this.sprite = this.s_right;
        }
        if (upping) {
            this.sprite = this.s_up;
        }
        if (lefting) {
            this.sprite = this.s_left;
        }
        if (downing && lefting) {
            this.sprite = this.s_downleft;
        }
        if (downing && righting) {
            this.sprite = this.s_downright;
        }
        if (upping && lefting) {
            this.sprite = this.s_upleft;
        }
        if (upping && righting) {
            this.sprite = this.s_upright;
        }
    }
     
    increaseHealth() {
        this.health += 100;
        localStorage.setItem('health', this.health);
    }

    getPos() {
        return {x:this.x, y:this.y}
    }

    getHealth() {
        return this.health;
    }

    setStreak(s) {
        this.streak = s;
    }

    draw() {
        this.ctx.shadowBlur = 0;
        this.ctx.drawImage(this.sprite, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        this.ctx.lineWidth = 10 * this.streak;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = YELLOW;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 40, -Math.PI/2, (Math.PI * (2 * this.streak)) - Math.PI/2);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export default Ship;