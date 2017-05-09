var player;
var obstacles = [];
var myScore;
var background;
var bonus = [];
var points = 0;
var test;
var active = 0;

function startGame() {
    gameArea.start();
    player = new component(30, 30, 'plane.jpg', 10, 120, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    background = new component(480, 270, 'sky.jpg', 0, 0, "image");
    test = false;
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.id = 'gameArea';
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.ctx2  = this.context;
        document.body.insertBefore(this.canvas, document.body.childNodes[6]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval((this.interval));
    }
}

function component(width, height, color, x, y, type) {
    ctx = gameArea.ctx2;
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
        this.image.onload = function () {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }

    }

    this.update = function () {
        ctx = gameArea.ctx2;

        if(type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }

        else if(type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
        var framePoints = gameArea.frameNo;
        var x;
        for (i = 0; i < obstacles.length; i += 1){
            if(player.crashWith(obstacles[i])){
                gameArea.stop();
                return;
            }
        }
    for (i = 0; i < bonus.length; i += 1){

        if(test == true)
        {
            if (player.crashWith(bonus[active]) == false)
            {
                test = false;
                if (player.crashWith(bonus[i]) == true && test == false)
                {
                    points = points + 200;
                    test = true;
                    active = i;
                }
            }
        }
        else
        {
            if (player.crashWith(bonus[i]) == true)
            {
                points = points + 200;
                test = true;
                active = i;
            }
        }
    }

        gameArea.clear();
        background.update();
        gameArea.frameNo += 1;
        if(gameArea.frameNo == 1 || everyinterval(200)){
            x = gameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

            obstacles.push(new component(10, height, "green", x, 0));
            obstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for(i = 0; i < obstacles.length; i += 1){
            obstacles[i].x += -1;
            obstacles[i].newPos();
            obstacles[i].update();
        }
    if(everyinterval(150)){
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        bonus.push(new component(10, 10, "gold", x, height));
    }
    for(i = 0; i < bonus.length; i += 1){
        bonus[i].x += -1;
        bonus[i].newPos();
        bonus[i].update();
    }
        player.speedX = 0;
        player.speedY = 0;
        if (gameArea.keys && gameArea.keys[37]) {player.speedX = -3;}
        if (gameArea.keys && gameArea.keys[39]) {player.speedX = 3;}
        if (gameArea.keys && gameArea.keys[38]) {player.speedY = -3;}
        if (gameArea.keys && gameArea.keys[40]) {player.speedY = 3;}
        player.newPos();
        player.update();
        myScore.text = "Score: " + (points + framePoints);
        myScore.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}