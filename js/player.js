var player_img = new Image();
player_img.src = 'img/pdd.png';

// class Player
function Player() {
    this.color = "#156AEB";

    // size
    this.width = 96;
    this.height = 16;

    // positions
    this.pos = "bottom";
    this.x = 0;
    this.y = 0;

    // score
    this.score = 0;

    //winner
    this.msg = "";

    // movements
    this.is_using_mouse = false;
    this.is_moving_right = false;
    this.is_moving_left = false;
    this.MAX_SPEED = 20;
    this.ACCELERATION = 5;
    this.velocity_x = 1;
    this.velocity_y = 1;

    
}

// set player's position
Player.prototype.setPosition = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
}

// detect collision with walls
Player.prototype.collidesWithWall = function(wall) {
    if (wall.dir == "left" && this.x < (wall.x + wall.w)) {
        this.x = wall.x + wall.w;
    }

    else if (wall.dir == "right" && wall.x < (this.x + this.width)) {
        this.x = wall.x - this.width;
    }
}

// update player's data
Player.prototype.update = function () {
    // moving right
    if (this.is_moving_right) {
        this.velocity_x += this.ACCELERATION;

        // exceeded max_speed ?
        if (this.velocity_x > this.MAX_SPEED) {
            this.velocity_x = this.MAX_SPEED;
        }

        this.x += this.velocity_x;
    }

    // moving left
    else if (this.is_moving_left) {
        this.velocity_x -= this.ACCELERATION;

        // exceeded max_speed ?
        if (this.velocity_x < - this.MAX_SPEED) {
            this.velocity_x = - this.MAX_SPEED;
        }

        this.x += this.velocity_x;
    }

    // not moving
    else {
        // player was moving? -> slow down
        if (this.velocity_x != 0) {
            // right
            if (this.velocity_x > 0) {
                this.velocity_x -= this.ACCELERATION;

                if (this.velocity_x < 0) {
                    this.velocity_x = 0;
                }
            }

            // left
            else {
                this.velocity_x += this.ACCELERATION;

                if (this.velocity_x > 0) {
                    this.velocity_x = 0;
                }
            }
        }
    }

    // collides with right_wall
    this.collidesWithWall(board.left_wall);
    this.collidesWithWall(board.right_wall);

    // stop motion if mouse stopped
    if (this.is_using_mouse) {
        this.is_moving_left = false;
        this.is_moving_right = false;
    }
}

// draw player
Player.prototype.draw = function(context) {
    //context.fillStyle = this.color;
    //context.fillRect(this.x, this.y, this.width, this.height);

    context.drawImage(player_img, this.x, this.y);

}