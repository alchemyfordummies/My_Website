/*
 Sets up the canvas for the game to be played on
 */
var context;
var keysDown = {};
var balls = 1;
var ballRadius = 5;
var computerScore = 0;
var humanScore = 0;

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

//Sets the background's size
window.onload = function() {
    var canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    animate(step);
};

/*First major function in getting it all working*/
//Each step in updating the canvas, updates what's
//going on, renders it, then calls itself again
var step = function() {
    update();
    render();
    animate(step);
};

/*Second major function*/
//Does three different updates:
//Updates the player
//updates the computer (based on the ball's position)
//Updates the ball based on where it hits
var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

//renders the canvas to the specified size, then renders the
//player paddle, the computer paddle, and the ball
var render = function() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0,window.innerWidth, window.innerHeight);
    player.render();
    computer.render();
    ball.render();
};

var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function(callback) {window.setTimeout(callback, 1000/60)};

function PowerUp(power, x, y) {
    //Selects a random number, there will be three powers
    switch(this.power = Math.floor(Math.random()*3 + 1)) {
        case 1:
            balls = 2;
            ball2 = new Ball(window.innerWidth/2, window.innerHeight/2);
            break;
        case 2:
            setSpeed(ball);
            break;
        case 3:
            ballRadius = 10;
            break;
    }

    this.x = window.innerWidth/2;
    this.y = window.innerHeight/2;
    this.radius = 15;
}

function setSpeed(ball) {
    ball.x_speed *= 2;
    ball.y_speed *= 2;
}

function setLocation(paddle) {
    paddle.width *= 2;
}

//creates a new paddle with given dimensions
//and speed, etc
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

//renders the given paddle
Paddle.prototype.render = function() {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

//New paddle of that size/dimension
function Player() {
    this.paddle = new Paddle(window.innerWidth/2-65, window.innerHeight-20, 130, 15);
}

//new paddle of that size/dimension
function Computer() {
    this.paddle = new Paddle(window.innerWidth/2-65, 10, 130, 15);
}

//renders a player paddle
Player.prototype.render = function() {
    this.paddle.render();
};

//renders a computer paddle
Computer.prototype.render = function() {
    this.paddle.render();
};

//Creates a ball object
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 12;
    this.radius = ballRadius;
    ballRadius = 5;
}

//Renders the path of the ball
Ball.prototype.render = function() {
    context.beginPath();
    //Calculates the path based on those coordinates
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();
};

//calls a player and computer and makes a ball at the specified coordinate
var player = new Player();
var computer = new Computer();
var ball = new Ball(window.innerWidth/2, window.innerHeight/2);

//Updates the ball
Ball.prototype.update = function(paddle1, paddle2) {
    //adds the new speed to the old one
    this.x += this.x_speed;
    this.y += this.y_speed;
    //radius is 5, so it'll hit the wall 5 pixels before
    //the middle, so we offset it by 5
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if(this.x - 5 < 0) { // hitting the left wall
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if(this.x + 5 > window.innerWidth) { // hitting the right wall
        this.x = window.innerWidth-5;
        this.x_speed = -this.x_speed;
    }

    if(this.y < 0 || this.y > window.innerHeight) { // a point was scored
        this.y_speed = 0;
        this.x_speed = 0;
        //Changes the alert message depending on where the ball went off
        //could be shorter, just not sure how offhand
        if (this.y > window.innerHeight) {
            window.setTimeout(
                function(){
                    computerScore++;
                    alert("Computer score! " + computerOrHumanScoreFirst())
                }
            );
        } else if (this.y < 0) {
            window.setTimeout(
                function(){
                    humanScore++;
                    alert("Human score! " + computerOrHumanScoreFirst())
                }
            );
        }

        //busies the computer for a bit
        window.setTimeout(
            function() {
                for (var i = 0; i < 1000000000; i++) {}
            }
        );

        //sets the paddles back to default
        player = new Player();
        computer = new Computer();
        this.x_speed = 0;
        this.y_speed = 12;
        this.x = window.innerWidth/2;
        this.y = window.innerHeight/2;
    }

    function computerOrHumanScoreFirst() {
        if (humanScore > computerScore) {
            return humanScore + '-' + computerScore;
        } else {
            return computerScore + '-' + humanScore;
        }
    }

    //Condition for if it's in the top half
    if(top_y > window.innerHeight/2) {
        if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width)
            && bottom_x > paddle1.x) {
            // hit the player's paddle
            this.y_speed = -10;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
        //condition for bottom half
    } else {
        if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width)
            && bottom_x > paddle2.x) {
            // hit the computer's paddle
            this.y_speed = 10;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

//Updates the player paddle
Player.prototype.update = function() {
    for(var key in keysDown) {
        //Conditions for a couple keys
        var value = Number(key);
        if(value == 37) { // left arrow
            this.paddle.move(-12, 0);
        } else if (value == 39) { // right arrow
            this.paddle.move(12, 0);
        }
    }
};

//Moves the paddle
Paddle.prototype.move = function(x, y) {
    //adds the coordinates to move it in whatever direction it needs
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { // all the way to the left
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > window.innerWidth) { // all the way to the right
        this.x = window.innerWidth - this.width;
        this.x_speed = 0;
    }
};

//Updates the computer paddle based on the position of the ball
Computer.prototype.update = function(ball) {
    var x_pos = ball.x;
    //takes the difference in position between the ball and the paddle
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    //helps make movement more efficient
    if(diff < 0 && diff < -4) { // max speed left
        diff = -12;
    } else if(diff > 0 && diff > 4) { // max speed right
        diff = 12;
    }
    this.paddle.move(diff, 0);
    //won't fly offscreen
    if(this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > window.innerWidth) {
        this.paddle.x = window.innerWidth - this.paddle.width;
    }
};