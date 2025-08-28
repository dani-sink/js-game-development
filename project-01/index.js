 /* Sprite Animation logic */

let playerState = 'idle'; // Variable to keep track of player State

const dropdown = document.getElementById('animations');

dropdown.addEventListener('change', function(e) {
    playerState = e.target.value;
});

/* 1. Set up the Canvas for drawing and animating the different sprites */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;


/* 2. Set up the image that will store our sprites */
const playerImage = new Image();
playerImage.src = 'shadow_dog.png';


/* 3.a. Single out each frame by taking the dimensions of a single sprite  */
const spriteWidth = 575;
const spriteHeight = 523;

/* 3.b. Delay animation of each imag to create a frame stagger and make animation more smooth */
let gameFrame = 0; 
const staggerFrames = 20;



/* 
    4.a Set up the object that will store the location of all the sprites/frames for each animation 
    type (idle, jump, etc...) in the original image. Each frame location will be stored in the loc property, 
    which is an array. It will look like this:

    spriteAnimations = {
        "idle": {
            "loc": [
                {x: a; y: b}
            ]
        },
        "jump": {
            ...
        },
        ....
    }

    where a and b are integers.
 */
const spriteAnimations = {};


/* 4.b Set up the array of objects where each object associates an animation type with 
  the number of different sprites/frames it has */
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    },
];


/* 5.a For each animation type, compute and compile the location of each sprite/frame associated with
    a particular animation inside a temp object that will have a loc property, which refers to an array 
    (as defined earlier in 4.b). Then create a new key named after the current animation state we are at
    and set its value as the temp object
 */
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    
    for (let i = 0; i < state.frames; ++i){
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY})
    }
    spriteAnimations[state.name] = frames;
});



/* 6. Animate the image inside the canavs 
     
    gameFrame: integer that gets incremented infinitely.
    staggerFrame: integer that sets the number of animate() calls needed before switching to the next frame
    position: integer that goes from 0 to frames, where is the number of frames for each animation,
    frameX: X coordinate of the current frame.
    frameY: Y coordinate of the current frame.
    playerImage: image object from where we pull the sprite.
    spriteWitdh: the width of the sprite/frame we want to draw.
    spriteHeight: the height of the sprite/frame we want to draw.
*/
function animate(){

    // Clear any previously drawn frame for the next frame to be drawn
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 

    /* 
        . Compute the position of the current frame to draw in the sprites image.

        . We have the relation: frames === spriteAnimations[playerState].loc.length,
        where frames is the number of frames that the current animation has.

        . Math.floor(gameFrame / staggerFrames) means that the next frame will be drawn after at 
        least staggerFrames number of calls to animate() have beeen made.
    */
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;

    /* Take the width of each frame, multiply by position(which is betweeen 0 and frames) and we get the x 
        coordinate of the current frame.
    */
    let frameX = spriteWidth * position;

    // All animations frames of the current animation have the same y coordinate, so just take one of them
    let frameY = spriteAnimations[playerState].loc[position].y;

    /* Now draw the actual frame with the variables we defined earlier. 

     Template --> drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) where:
        . img is the image object we pull the sprite from.
        . sx is the source image x coordinate where the delimitation in the original image starts.
        . sy is the source image y coordinate where the delimitation in the original image starts.
        . sw is the width of the section of image we want to delimitate in the original image.
        . sh is the height of the section of image we want to delimitate in the original image.
        . dx is the x coordinate where the newly drawn image will start in the destination canvas.
        . dy is the y coordinate where the newly drawn image will start in the destination canvas.
        . dw is the width of the newly drawn image in the destination canvas.
        . dh is the height of the newly drawn image in the destination canvas.
     */

    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    
    gameFrame++;
    requestAnimationFrame(animate); // Recursive call to animate so that it gets called indefinitely.
};

animate();