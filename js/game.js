// request animation frame (smooth animation by the browser 60fps)
window.requestAnimFrame = (function() {
   return window.requestAnimationFrame      ||
       window.webkitRequestAnimationFrame   ||
       window.mozRequestAnimationFrame      ||
       function(callback) {
           window.setTimeout(callback, 1000 / 60);
       }
})();

window.cancelAnimFrame = (function() {
   return window.cancelAnimationFrame           ||
       window.webkitCancelRequestAnimationFrame ||
       window.mozCancelRequestAnimationFrame    ||
       function() {
           window.clearTimeout();
       }
})();

// set width & height of canvas
var W = window.innerWidth,
    H = window.innerHeight;

var canvas = document.getElementById('game_canvas'),
    ctx = canvas.getContext("2d");

canvas.width = W;
canvas.height = H;

var board = {
    // x, y positions
    x: 0,
    y: 0,

    // width & height
    w: W,
    h: H,

    // walls
    top_wall: {
        dir: "top",
        x: W/4,
        y: 10,
        w: W/2 + 5,
        h: 5
    },

    bottom_wall: {
        dir: "bottom",
        x: W/4,
        y: H-20,
        w: W/2 + 5,
        h: 5
    },

    right_wall: {
        dir: "right",
        x: (3 * W) / 4,
        y: 10,
        w: 5,
        h: H - 30
    },

    left_wall: {
        dir: "left",
        x: W/4,
        y: 10,
        w: 5,
        h: H - 30
    },

    goal_wdith: 300,

    draw: function() {
        ctx.clearRect(this.x, this.y, this.w, this.h);

        // fill rect
        ctx.fillStyle = "#56af65";
        ctx.fillRect(this.x, this.y, this.w, this.h)


          
        // walls
        ctx.fillStyle = "#fff";

        ctx.fillRect(this.left_wall.x, this.left_wall.y, this.left_wall.w, this.left_wall.h); // left
        ctx.fillRect(this.right_wall.x, this.right_wall.y, this.right_wall.w, this.right_wall.h); // right
        ctx.fillRect(this.top_wall.x, this.top_wall.y, this.top_wall.w, this.top_wall.h); // top
        ctx.fillRect(this.bottom_wall.x, this.bottom_wall.y, this.bottom_wall.w, this.bottom_wall.h); // bottom

        // negilla dashed rectangles (Captin Magid Style ;))
        var ground_height = this.bottom_wall.y - (this.top_wall.y + this.top_wall.h);
        var yi = 15;
        for (i=1; i <= 11; i++) {
            if ((i % 2) == 0) {
                ctx.fillStyle = "#89AF4C";
            } else {
                ctx.fillStyle = "#4C9B1D";
            }

            ctx.fillRect(W/4 + 5, yi, W/2 - 5, ground_height/11);

            yi += ground_height/11;
        }

        // dashed line & circles
        ctx.beginPath();

        // small circle
        ctx.fillStyle = '#fff';
        ctx.arc(W/2, H/2, 5, 0, 2 * Math.PI, false);
        ctx.fill();

        // big circle in the center
        ctx.arc(W/2, H/2, 60, 0, 2 * Math.PI, false);

        // dashed line in the middle
        ctx.moveTo(W/4 + 5, H/2);
        ctx.lineTo(3 * W/4,H/2);
        ctx.strokeStyle = '#fff';

        ctx.stroke();

        // Top Goal
        ctx.beginPath();
        ctx.moveTo(W/2 - this.goal_wdith/2, 15);
        ctx.lineTo(W/2 - this.goal_wdith/2, 100);
        ctx.lineTo(W/2 + this.goal_wdith/2, 100);
        ctx.lineTo(W/2 + this.goal_wdith/2, 15);
        ctx.stroke();

        // bottom Goal
        ctx.beginPath();
        ctx.moveTo(W/2 - this.goal_wdith/2, H-15);
        ctx.lineTo(W/2 - this.goal_wdith/2, H-100);
        ctx.lineTo(W/2 + this.goal_wdith/2, H-100);
        ctx.lineTo(W/2 + this.goal_wdith/2, H-15);
        ctx.stroke();

        // half-circle on Top Goal
        ctx.beginPath();
        ctx.arc(W/2, 100, 50, 0, 2 * Math.PI / 2, false);
        ctx.stroke();

        // half-circle on Bpttom Goal
        ctx.beginPath();
        ctx.arc(W/2, H-100, 50, 2 * Math.PI / 2, 0, false);
        ctx.stroke();


    }
}

// ball
ball = new Ball();
ball.setPosition(W/2 - 16, H/2 - 16);
ball.moving_down = true;
ball.moving_left = true;

// player
players = [];

// player 1
var player_1 = new Player();
player_1.setPosition(W/2 - player_1.width/2, H-40);
player_1.pos = "bottom";
players.push(player_1)

// player 2
var player_2 = new Player();
player_2.setPosition(W/2 - player_2.width/2, 20);
player_2.pos = "top";
player_2.is_using_mouse = true;
players.push(player_2);

var score = {};
score.draw = function(context) {
    context.font = "20px serif";
    context.fillText("Player 1", (W/8) - 15, (3 * H / 4) - 50)
    context.fillText("Player 2", (W/8) - 15, (H / 4) - 50)

    

    context.font = "50px digital_font";
    context.fillText(player_1.score, W/8, 3 * H/4);
    context.fillText(player_2.score, W/8, H/4);
}

// update [positions & collision detection]
function update() {
    processGamePad();

    ball.update();

    for (i in players) {
        players[i].update()
    }

    // v.basic AI - move player_2 automatically
    /*
    if (ball.moving_up) {
        player_2.x = ball.x - player_2.width/2 + ball.width/2;

        player_2.collidesWithWall(board.left_wall);
        player_2.collidesWithWall(board.right_wall);
    }
    */
}

// draw player
function draw() {
    // update [player positions & collision detections]
    update();

    // draw
    board.draw();

    ball.draw(ctx);

    for (i in players) {
        players[i].draw(ctx)
    }

    // score
    score.draw(ctx);

    requestAnimFrame(draw)
}

// init
draw();


// respond to mouse events

var prevMouseX = 0;
var prevMouseY = 0;
canvas.onmousemove = function(e) {
    if (e.pageX > prevMouseX) {
        player_2.is_moving_right = true;
        player_2.is_moving_left = false;
    }

    else if (e.pageX < prevMouseX) {
        player_2.is_moving_left = true;
        player_2.is_moving_right = false;
    }

    else {
        player_2.is_moving_right = false;
        player_2.is_moving_left = false;
    }

    prevMouseX = e.pageX;
}


// respond to keyboard events
document.onkeydown = function(e) {
    // left
    if (e.keyCode == 37 || e.keyCode == 65) {
        player_1.is_moving_left = true;
    }

    // right
    else if (e.keyCode == 39 || e.keyCode == 68) {
        player_1.is_moving_right = true;
    }
}

document.onkeyup = function(e) {
    // left
    if (e.keyCode == 37 || e.keyCode == 65) {
        player_1.is_moving_left = false;
    }

    // right
    else if (e.keyCode == 39 || e.keyCode == 68) {
        player_1.is_moving_right = false;
    }
}

// gamepad :)
function processGamePad() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    var gp = gamepads[0];
    // gameController buttons
    if (gp != undefined &&  gp.connected) {
        //console.log(gp.axes[0])
        // right
        if (gp.axes[0] == 1) {
            player_1.is_moving_right = true;
        }

        // left
        else if (gp.axes[0] == -1) {
            player_1.is_moving_left = true;
        }

        else {
            // reset motion
            player_1.is_moving_right = false;
            player_1.is_moving_left = false;
        }
    }
}