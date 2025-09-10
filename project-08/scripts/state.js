export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    JUMPING_LEFT: 6,
    JUMPING_RIGHT: 7,
    FALLING_LEFT: 8,
    FALLING_RIGHT: 9,
};

class State {
    constructor(state){
        this.state = state; 
    }
}

export class StandingLeft extends State {
    constructor(player){
        super('STANDING LEFT');
        this.player = player;
    }

    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 1;
        this.player.speed = 0;
    }
    
    handleInput(input){
        if (input === 'PRESS right'){ // set state to RunningRight
            this.player.setState(states.RUNNING_RIGHT);
        } else if (input === 'PRESS left'){ // set state to RunningLeft
            this.player.setState(states.RUNNING_LEFT);
        } else if (input === 'PRESS down') {
            this.player.setState(states.SITTING_LEFT); // set state to SittingLeft
        } else if (input === 'PRESS up') {
            this.player.setState(states.JUMPING_LEFT); // set state to JumpingLeft
        }
    }
}


export class StandingRight extends State {
    constructor(player){
        super('STANDING RIGHT');
        this.player = player;
    }
    
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 0;
        this.player.speed = 0;
    }
    
    handleInput(input){
        if (input === 'PRESS left'){ // set state to RunningLeft
            this.player.setState(states.RUNNING_LEFT);
        } else if (input === 'PRESS right'){ // set state to RunningRight
            this.player.setState(states.RUNNING_RIGHT);
        } else if (input === 'PRESS down') {
            this.player.setState(states.SITTING_RIGHT); // set state to SittingRight
        } else if (input === 'PRESS up') {
            this.player.setState(states.JUMPING_RIGHT); // set state to JumpingRight
        }
    }
}


export class SittingLeft extends State {
    constructor(player){
        super('SITTING LEFT');
        this.player = player;
    }
    
    enter(){
        this.player.maxFrame = 4;
        this.player.frameY = 9;
        this.player.speed = 0;
    }
    
    handleInput(input){
        if (input === 'PRESS right'){ // set state to SittingRight
            this.player.setState(states.SITTING_RIGHT);
        } else if (input === 'RELEASE down') { // set state to StandingRight
            this.player.setState(states.STANDING_LEFT);            
        }
    }
}


export class SittingRight extends State {
    constructor(player){
        super('SITTING RIGHT');
        this.player = player;
    }
    
    enter(){
        this.player.maxFrame = 4;
        this.player.frameY = 8;
        this.player.speed = 0;
    }
    
    handleInput(input){
        if (input === 'PRESS left'){ // set state to SittingLeft
            this.player.setState(states.SITTING_LEFT);
        } else if (input === 'RELEASE down') { // set state to StandingRight
            this.player.setState(states.STANDING_RIGHT);            
        }
    }
}



export class RunningLeft extends State {
    constructor(player){
        super('RUNNING LEFT');
        this.player = player;
    }
    
    enter(){
        this.player.maxFrame = 8;
        this.player.frameY = 7;
        this.player.speed = -this.player.maxSpeed;
    } 
    
    handleInput(input){
        if (input === 'PRESS right'){ // set state to RunningRight
            this.player.setState(states.RUNNING_RIGHT);
        } else if (input === 'RELEASE left') { // set state to StandingLeft
            this.player.setState(states.STANDING_LEFT);             
        } else if (input === 'PRESS down') { // set state to SittingLeft
            this.player.setState(states.SITTING_LEFT); 
        } else if (input === 'PRESS up') {
            this.player.setState(states.JUMPING_LEFT);
        }
    }
}


export class RunningRight extends State {
    constructor(player){
        super('RUNNING RIGHT');
        this.player = player;
    }
    
    enter(){
        this.player.maxFrame = 8;
        this.player.frameY = 6;
        this.player.speed = this.player.maxSpeed;
    }
    
    handleInput(input){
        if (input === 'PRESS left'){ // set state to RunningLeft
            this.player.setState(states.RUNNING_LEFT);
        } else if (input === 'RELEASE right') { // set state to StandingRight
            this.player.setState(states.STANDING_RIGHT);             
        } else if (input === 'PRESS down') { // set state to SittingRight
            this.player.setState(states.SITTING_RIGHT); 
        } else if (input === 'PRESS up') {
            this.player.setState(states.JUMPING_RIGHT);
        }
    }
}


export class JumpingLeft extends State {
    constructor(player){
        super('JUMPING LEFT');
        this.player = player;
    }
     
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 3;
        if (this.player.onGround()) {
            this.player.vy -= 15;
        }
        this.player.speed = -this.player.maxSpeed * 0.5;
    } 
    
    handleInput(input){
        if (input === 'PRESS right') {
            this.player.setState(states.JUMPING_RIGHT); // set state to JumpingRight
        } else if (this.player.onGround()){
            this.player.setState(states.STANDING_LEFT) // set state to StandingLeft
        } else if (this.player.vy > 0) {
            this.player.setState(states.FALLING_LEFT); // set state to FallingLeft
        }
    }
}

export class JumpingRight extends State {
    constructor(player){ 
        super('JUMPING RIGHT');
        this.player = player;
    }
     
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 2;
        if (this.player.onGround()){
            this.player.vy -= 15;
        }
        this.player.speed = this.player.maxSpeed * 0.5;
    } 
    
    handleInput(input){
        if (input === 'PRESS left') {
            this.player.setState(states.JUMPING_LEFT); // set state to JumpingLeft
        } else if (this.player.onGround()){
            this.player.setState(states.STANDING_RIGHT) // set state to StandingRight
        } else if (this.player.vy > 0) {
            this.player.setState(states.FALLING_RIGHT); // set state to FallingRight
        }
    }
}


export class FallingLeft extends State {
    constructor(player){
        super('FALLING LEFT');
        this.player = player;
    }
     
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 5;
        
    } 
    
    handleInput(input){
        if (input === 'PRESS right') {
            this.player.setState(states.FALLING_RIGHT); // set state to FallingRight
        } else if (this.player.onGround()){
            this.player.setState(states.STANDING_LEFT) // set state to StandingLeft
        }
    }
}


export class FallingRight extends State {
    constructor(player){
        super('FALLING RIGHT');
        this.player = player;
    }
     
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 4;
        
    } 
    
    handleInput(input){
        if (input === 'PRESS left') {
            this.player.setState(states.FALLING_LEFT); // set state to FallingLeft
        } else if (this.player.onGround()){
            this.player.setState(states.STANDING_RIGHT) // set state to StandingRight
        }
    }
}