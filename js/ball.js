var ball_img = new Image();
ball_img.src = 'img/ball.png';

var wall_sound = new Audio();
wall_sound.src = 'audio/click.wav';

var player_sound = new Audio();
player_sound.src = 'audio/click2.wav';

var score_sound = new Audio();
score_sound.src = 'audio/clapping.mp3';

// class ball
function Ball() {
    // size
    this.width = 32;
    this.height = 32;

    // positions
    this.x = 0;
    this.y = 0;

    // movement
    this.MAX_SPEED = 5;
    this.ACCELERATION = 0.2;
    this.velocity_x = 1;
    this.velocity_y = 1;
    this.moving_up = false;
    this.moving_down = false;
    this.moving_left= false;
    this.moving_right = false;
}

// set ball's position
Ball.prototype.setPosition = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
}

// detect collision with walls
Ball.prototype.collidesWithWall = function(wall) {
    if (wall.dir == "left" && this.x < (wall.x + wall.w)) {
        this.moving_left = false;
        this.moving_right =true;
        wall_sound.play();
    }

    else if (wall.dir == "right" && wall.x < (this.x + this.width)) {
        this.moving_right = false;
        this.moving_left = true;
        wall_sound.play();
    }

    else if (wall.dir == "top" && ball.y < (wall.y + wall.h)) {
        if ((this.x + this.width/2) >= W/2 - board.goal_wdith/2 &&
            (this.x + this.width/2) <= W/2 + board.goal_wdith/2 ) {

            score_sound.play();
            player_1.score++;
        }

        this.moving_up = false;
        this.moving_down = true;
        wall_sound.play();
    }

    else if (wall.dir == "bottom" && wall.y < (this.y + this.height)) {
        // check if collided with the goal
        if ((this.x + this.width/2) >= W/2 - board.goal_wdith/2 &&
            (this.x + this.width/2) <= W/2 + board.goal_wdith/2 ) {

            score_sound.play();
            player_2.score++;
        }

        this.moving_down = false;
        this.moving_up = true;
        wall_sound.play();
    }
}

// detect collision with players
Ball.prototype.collidesWithPlayer = function(player) {
    var is_collided = false;
    if (player.pos == "bottom" &&
        // ball's X position is between player's width
        this.x > player.x && this.x < (player.x + player.width) &&
        // ball touched the player
        player.y < (this.y + this.height)) {

        this.moving_down = false;
        this.moving_up = true;

        is_collided = true;
    }

    else if (player.pos == "top" &&
        // ball's X position is between player's width
        this.x > player.x && this.x < (player.x + player.width) &&
        // the ball touched the player
        ball.y < (player.y + player.height)) {
        this.moving_up = false;
        this.moving_down = true;

        is_collided = true;
    }

    // change ball direction based on player's direction
    if (is_collided) {
        player_sound.play();

        if (player.is_moving_left) {
            this.moving_right = false;
            this.moving_left = true;
        }

        else if (player.is_moving_right) {
            this.moving_left = false;
            this.moving_right = true;
        }
    }
}

// update
Ball.prototype.update = function() {
    this.velocity_x += this.ACCELERATION;
    this.velocity_y += this.ACCELERATION;

    if (this.velocity_x > this.MAX_SPEED) {
        this.velocity_x = this.MAX_SPEED;
    }

    if (this.velocity_y > this.MAX_SPEED) {
        this.velocity_y = this.MAX_SPEED;
    }

    // collides with right_wall
    this.collidesWithWall(board.left_wall);
    this.collidesWithWall(board.right_wall);
    this.collidesWithWall(board.top_wall);
    this.collidesWithWall(board.bottom_wall);

    // collision with players
    this.collidesWithPlayer(player_1);
    this.collidesWithPlayer(player_2);

    if (this.moving_right) {
        this.x += this.velocity_x;
    }

    else if (this.moving_left) {
        this.x -= this.velocity_x;
    }

    if (this.moving_down) {
        this.y += this.velocity_y;
    }

    else if (this.moving_up) {
        this.y -= this.velocity_y;
    }
};

// draw ball
Ball.prototype.draw = function(context) {
    context.drawImage(ball_img, this.x, this.y);
}