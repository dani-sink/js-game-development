// Set up thhe canvas

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 2.5; // dynamic value that we can change later


// Set up background layers for the parallax background

const backgroundLayer1 = new Image();
backgroundLayer1.src = './assets/layer-1.png';

const backgroundLayer2 = new Image();
backgroundLayer2.src = './assets/layer-2.png';

const backgroundLayer3 = new Image();
backgroundLayer3.src = './assets/layer-3.png';

const backgroundLayer4 = new Image();
backgroundLayer4.src = './assets/layer-4.png';

const backgroundLayer5 = new Image();
backgroundLayer5.src = './assets/layer-5.png';


/* Since the images can be large, make the parallax background functionality only run when all the content
has been loaded on the page. */

window.addEventListener('load', function(){
    const slider = document.getElementById('slider'); // Slider to control game speed
    slider.value = gameSpeed; // set it to gameSpeed initially

    const showGameSpeed = document.getElementById('showGameSpeed'); // Let the user know the current game speed
    showGameSpeed.innerHTML = gameSpeed;

    // The slider will modify the game speed everytime it is changed by the user
    slider.addEventListener('change', function(e) {
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    }) 



    /* 
        Class acting as a template for all the layers we will add in the canvas.
        Attributes:
            . this.x: position on horizontal axis
            . this.y: position on vertical axis.
            . this.width: width of image.
            . this.height: height of image.
            . this.image: image object that will store the image file.
            . this.speedModifier: multiplier tied to the game speed to change the speed
            of the layer relative to the current gameSpeed, set globally.

        Methods:
            . update(): When called, this method updates the speed and x-coordinate of "this" layer object,
            creating an endless scrolling effect from right to left.

            . draw(): When called, this method draws the same image twice, next to each other 
            to help create an endless parallax effect.
    */

    
    class Layer {
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier; // set layer speed relative to game speed
        }

        
        update(){
            this.speed = gameSpeed * this.speedModifier; // update layer speed relative to game speed

            // If this.x reaches the value -this.width, the image is out of view in the canvas.
            if (this.x <= -this.width){
                this.x = 0; // Set the image back to its initial starting position in the canvas
            }
            this.x = Math.floor(this.x - this.speed); // Decrease the x position to create a scrolling effect from right to left.
        }

        
        draw(){
            // Draw the first image starting at position (this.x, this.y)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

            // Draw the first image starting at position (this.x + this.width, this.y)
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }


    // Create Layer class instances for each background layer and put them in an array

    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);

    const layerInstances = [layer1, layer2, layer3, layer4, layer5];
    
    
    // This function is called at each animation frame indefinitely
    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear any previously drawn image
        
        layerInstances.forEach(layer => {
            layer.update();
            layer.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
});


