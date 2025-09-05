/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');

collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight; 
let score = 0;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
ctx.font = '50px Impact';
let gameOver = 0;

let ravens = [];

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 1.5 + .3; 
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './assets/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ', ' + this.randomColors[1] + ', ' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltaTime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = -this.directionY;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame){
                this.frame = 0;
            } else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
            if (this.hasTrail) {
                for (let i = 0; i < 5; ++i){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < 0 - this.width) {
            gameOver = true;
        }
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];

class Explosion {
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src =  './assets/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.sound = new Audio();
        this.sound.src = './assets/launches/flaunch.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.frame = 0;
        this.markedForDeletion = false;
    }

    update(deltaTime){
        if (this.frame === 0) {
            this.sound.play();
        }
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5){
                this.markedForDeletion = true;
            }
        }
    } 
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size * 0.25, this.size, this.size);
    }
}
 
let particles = [];

class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size * 0.5 + Math.random() * 50 - 25; 
        this.y = y + this.size * 0.333 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size * 0.1;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color; 
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.3;
        if (this.radius > this.maxRadius - 5) {
            this.markedForDeletion = true;
        }
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 52.5, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER! Your Score is: ' + score, canvas.width * 0.5, canvas.height * 0.5);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER! Your Score is: ' + score, canvas.width * 0.5 + 3, canvas.height * 0.5 + 3);
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pixelColors = detectPixelColor.data;
    ravens.forEach(raven => {
        if (raven.randomColors[0] === pixelColors[0] && raven.randomColors[1] === pixelColors[1] &&
            raven.randomColors[2] === pixelColors[2]) {
                raven.markedForDeletion = true;
                score++;
                explosions.push(new Explosion(raven.x, raven.y, raven.width));
        }
    });
})

function animate(timeStamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime; // difference in milliseconds between last frame and current frame
    lastTime = timeStamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort((a, b) => a.width - b.width);
    }
    drawScore(); 
    [...particles, ...ravens, ...explosions].forEach(raven => {
        raven.update(deltaTime);
    }); 
    [...particles, ...ravens, ...explosions].forEach(raven => {
        raven.draw();
    });
    ravens = ravens.filter(raven => raven.markedForDeletion === false);
    explosions = explosions.filter(explosion => explosion.markedForDeletion === false);
    particles = particles.filter(particle => particle.markedForDeletion === false);
    if (!gameOver){
        requestAnimationFrame(animate);
    } else {
        drawGameOver();
    }
}

animate(0);

