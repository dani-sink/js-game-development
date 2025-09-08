window.addEventListener('load', function(){
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;


    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', (e) =>  {
                console.log(e.key, this.keys); 
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1)
                {
                    this.keys.push(e.key);
                }
            })
            window.addEventListener('keyup', (e) =>  {
                console.log(e.key, this.keys); 
                if (    e.key === 'ArrowDown'|| 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight')
                {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                
            })
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 0.175;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
        }

        draw(context){
            
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height); 
        }

        update(input, deltaTime, enemies){
            // collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width * 0.5)  - (this.x + this.width * 0.5);
                const dy = (enemy.y + enemy.height * 0.5) - (this.y + this.height * 0.5);
                const distance = Math.sqrt(dx**2 + dy**2);
                if (distance < (enemy.width * 0.5 + this.width * 0.5)){
                    gameOver = true;
                }
            });

            // sprite animations
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // controls
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1){
                this.speed = -5;
            } 
            else {
                this.speed = 0;
            }

            // vertical jump impulse
            if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                this.vy -= 12;
            } 
            
            // horizontal movement
            this.x += this.speed;

            // vertical movement
            this.y += this.vy;


            // boundaries check
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > this.gameWidth - this.width){
                this.x = this.gameWidth - this.width;
            }

            // ground check
            if (!this.onGround()){
                this.maxFrame = 5;
                this.vy += this.weight;
                this.frameY = 1;
            } else {
                this.maxFrame = 8;
                this.vy = 0;
                this.frameY = 0;
            }

            if (this.y > this.gameHeight - this.height){
                this.y = this.gameHeight - this.height;
            }
        }

        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 1.5;
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }

        update(){
            this.x -= this.speed;
            if (this.x < 0 - this.width){
               this.x = 0; 
            }
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage'); 
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 2;
            this.markedForDeletion = false;
        }

        draw(context){
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height); 
        }

        update(deltaTime){
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width){
                this.markedForDeletion = true;
                score++;
            }
        }
    }


    function handleEnemies(deltaTime){
        if (enemyTimer > randomEnemyInterval + enemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });

        enemies = enemies.filter(enemy => enemy.markedForDeletion === false);
    }

    function displayStatusText(context){
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score, 22, 52);
        if (gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, Try again!', canvas.width * 0.5, 200);
            context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText('GAME OVER, Try again!', canvas.width * 0.5 + 2, 202);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const enemy1 = new Enemy(canvas.width, canvas.height);
    
    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;   
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver) { 
            requestAnimationFrame(animate);
        }
    }

    animate(0);
});