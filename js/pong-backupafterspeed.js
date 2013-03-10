// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var zoom = 1;//zoom: between 0-1 smaller, between 1 and infinite bigger //DO THE ZOOM THING!!!
canvas.width = 800;
canvas.height = 500;

canvas.id = "theCanvas";
difficulty = 1;// 0-1 very easy, 1 default, higher than 1 hard increase the ball speed but keeps bars slow
document.body.appendChild(canvas);

//AI OR HUMAN
var player1human = true;
var player2human = true;

//listen to keys
var keysDown = {};
var startGameSpeed = 400; //CHOOSE THE STARTING GAME SPEED
var gamespeed = startGameSpeed; 
addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

startTheGame = function () {
	
	
	var ball = {speedX: 0, speedY: 0, width:15, x:canvas.width/2, y:canvas.height/2};
	var angle =
	var cosFactor = 0;
	var sinFactor = 0;
	
	//this function provides a new random angle to the ball in between limits of choice
	function newAngle() {
	var minAngle = 0.2; //rad
	var maxAngle = 0.8; //rad
	var angle = (maxAngle-minAngle)*Math.random()+minAngle; //between minAngle and maxAngle
	cosFactor = Math.cos(angle);
	sinFactor = Math.sin(angle);
	ball.speedX = difficulty*gamespeed*cosFactor;
	ball.speedY = difficulty*gamespeed*sinFactor;
	if (Math.random()>0.5) {ball.speedY=-ball.speedY;}
	}
	
	function increaseGameSpeed(amount) {
		if (gamespeed<3000) {//sets a limit to the speed increase. Around 4000 is the bar throught bug 
			gamespeed = gamespeed+amount;
			barPlayer1.speed = gamespeed;
			barPlayer2.speed = gamespeed;
			
			if (ball.speedX>0) {
				ball.speedX = ball.speedX+amount*cosFactor;
			} else {
				ball.speedX = ball.speedX-amount*cosFactor;
			}
			
			if (ball.speedY>0) {
				ball.speedY = ball.speedY+amount*sinFactor;
			} else {
				ball.speedY = ball.speedY-amount*sinFactor;
			}
		}
	}
	
	function effect() {
		if (38 in keysDown) {
			
		} //up
		if (40 in keysDown) {} //down
	}
	
	newAngle();
	
	//here the game objects
	var barPlayer1 = {speed: gamespeed, width:15, lenght:150, x:canvas.width/10, y:250};
	var barPlayer2 = {speed: gamespeed, width:15, lenght:150, x:canvas.width*9/10-barPlayer1.width, y:250};
	var scorePlayer1 = 0;
	var scorePlayer2 = 0;
	
	

	//whoWon is needed by reset to decide who gets the ball first
	var whoWon = 0;

	//update with new bars and ball coordinates
	function update (deltaT) {
		//Wanna stop? Back to menu...
		if (27 in keysDown) {
			gameMenu();
			clearInterval(gameInterval);
		}
		
		//Player 1 controller: 16 is arrow up and 17 arrow down
		if (player1human) {
			if (barPlayer1.y>0) {if (87 in keysDown) {barPlayer1.y-=barPlayer1.speed*deltaT}}
			if (barPlayer1.y<canvas.height-barPlayer1.lenght) {if (83 in keysDown) {barPlayer1.y+=barPlayer1.speed*deltaT}}
		} else {
			if (barPlayer1.y>0) {if (ball.y<barPlayer1.y+barPlayer1.lenght/4) {barPlayer1.y-=barPlayer1.speed*deltaT}}
			if (barPlayer1.y<canvas.height-barPlayer1.lenght) {if (ball.y>barPlayer1.y+barPlayer1.lenght*3/4) {barPlayer1.y+=barPlayer1.speed*deltaT}}
		}

		//Player 2 controller: 38 is arrow up and 40 arrow down
		//AI OR HUMAN
		if (player2human) {
			if (barPlayer2.y>0) {if (38 in keysDown) {barPlayer2.y-=barPlayer2.speed*deltaT}}
			if (barPlayer2.y<canvas.height-barPlayer2.lenght) {if (40 in keysDown) {barPlayer2.y+=barPlayer2.speed*deltaT}}
		} else {
			if (barPlayer2.y>0) {if (ball.y<barPlayer2.y+barPlayer2.lenght/4) {barPlayer2.y-=barPlayer2.speed*deltaT}}
			if (barPlayer2.y<canvas.height-barPlayer2.lenght) {if (ball.y>barPlayer2.y+barPlayer2.lenght*3/4) {barPlayer2.y+=barPlayer2.speed*deltaT}}
		}
		//top bounce
		if (ball.y<0) {
			ball.speedY=ball.speedY*(-1);
			ball.y = 0;
		}
		//bottom bounce
		if (ball.y>canvas.height-ball.width) {
			ball.speedY=ball.speedY*(-1);
			ball.y=canvas.height-ball.width;
		
		}
		//left bounce
		//if (ball.x<0) {ball.speedX=ball.speedX*(-1)} //take away to complete game
		//right bounce
		//wif (ball.x>canvas.width-ball.width) {ball.speedX=ball.speedX*(-1)} //take away to complete game
		
		//NEED TO CREATE A FRAME RATE ERROR, CALCULATE IT AND FIX IT REPOSITIONING THE BALL ON THE RIGHT LIMIT
		
		//barPlayer1 bounce
		if (
			(ball.y+ball.width>=barPlayer1.y) &&
			(ball.y<=barPlayer1.y+barPlayer1.lenght) &&
			(ball.x<barPlayer1.x+barPlayer1.width) &&
			(ball.x>barPlayer1.x+barPlayer1.width-barPlayer1.width)
		) {
			ball.speedX=ball.speedX*(-1);
			ball.x=barPlayer1.x+barPlayer2.width;
			increaseGameSpeed(25);
		}
		
		//barPlayer2 bounce
		if (
			(ball.y>=barPlayer2.y) &&
			(ball.y<=barPlayer2.y+barPlayer2.lenght) &&
			(ball.x+ball.width>barPlayer2.x) &&
			(ball.x+ball.width<barPlayer2.x+barPlayer2.width)
		) {
			ball.speedX=ball.speedX*(-1);
			ball.x=barPlayer2.x-ball.width;
			increaseGameSpeed(25);
		}
		
		//new ball coordinates 
		ball.x=ball.x+ball.speedX*deltaT;
		ball.y=ball.y+ball.speedY*deltaT;
		
		//if Player1 scores
		if (ball.x>canvas.width-ball.width) {
			scorePlayer1++;
			gamespeed = startGameSpeed;
			whoWon = 1;
			reset();
		}
		
		//if Player2 scores
		if (ball.x<0) {
			scorePlayer2++;
			gamespeed = startGameSpeed;
			whoWon = 2;
			reset();
		}

	}

	//render objects
	function render() {

		//renders background
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//score Player1
		ctx.fillStyle = "#ffffff";
		ctx.font = "5em StiffStaff, arial, helvetica, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillText(scorePlayer1, canvas.width/4, canvas.height/3);
		
		//score Player2
		ctx.fillStyle = "#ffffff";
		ctx.font = "5em StiffStaff, arial, helvetica, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillText(scorePlayer2, 3*canvas.width/4, canvas.height/3);
		
		//renders pingpong ball
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(ball.x, ball.y, ball.width, ball.width);
		
		//renders barPlayer1
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(barPlayer1.x, barPlayer1.y, barPlayer1.width, barPlayer1.lenght);
		
		//renders barPlayer2
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(barPlayer2.x, barPlayer2.y, barPlayer2.width, barPlayer2.lenght);
		
	}

	//reset the match after someone scores
	function reset() {
		
		newAngle()
		if (whoWon == 2) {
			ball.speedX = ball.speedX; 
			//ball.speedY = gamespeed;
		} else if (whoWon == 1) {
			ball.speedX = -ball.speedX; 
			//ball.speedY = -gamespeed;
		}
		ball.x = canvas.width/2; 
		ball.y = canvas.height/2;
		
	}



	//main game loop
	var main = function () {
		var now = Date.now();
		var delta = now-before;
		update(delta/1000);
		render();
	
		before=now;
	}


	var before = Date.now();
	var gameInterval = setInterval(main, 1); // 1 = Execute as fast as possible; 1000 = execute every second
}

//Here goes the game menu: in the future add choice for 1v2 or 1vc
gameMenu = function() {
	
	updateMenu = function () {
		if (32 in keysDown) {
			clearInterval(menuInterval);
			startTheGame();
		}
			
		if (65 in keysDown) {
			player1human = false;	
		}
		
		if (73 in keysDown) {
			player2human = false;	
		}
		
		if ((87 in keysDown)||(83 in keysDown)) {
			player1human = true;	
		}
		
		if ((38 in keysDown)||(40 in keysDown)) {
			player2human = true;	
		}
	}
	
	renderMenu = function() {
		
		//renders background: for the menu is white
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//PONG
		ctx.fillStyle = "#000000";
		ctx.font = "100px StiffStaff, arial, helvetica, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillText("Pong", canvas.width/2, canvas.height/4);
		
		//Player 1 Keyboard
		if (player1human) {
			ctx.fillStyle = "#000000";
			ctx.font = "40px StiffStaff, arial, helvetica, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "center";
			ctx.fillText("*Player 1*", canvas.width/4, canvas.height/2);
			ctx.fillText("Up: [w]", canvas.width/4, canvas.height/2+45);
			ctx.fillText("Down: [s]", canvas.width/4, canvas.height/2+90);
			ctx.font = "20px StiffStaff, arial, helvetica, sans-serif";
			ctx.fillText("Press [a] for AI", canvas.width/4, canvas.height/2+135);
		} else {
			ctx.fillStyle = "#000000";
			ctx.font = "60px StiffStaff, arial, helvetica, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "center";
			ctx.fillText("* A.I. *", canvas.width/4, canvas.height/2+50);
			ctx.font = "20px StiffStaff, arial, helvetica, sans-serif";
			ctx.fillText("Player 1 - Press [w] or [s]", canvas.width/4, canvas.height/2+135);
		}
		
		//VS
		ctx.fillStyle = "#000000";
		ctx.font = "40px StiffStaff, arial, helvetica, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillText("vs", canvas.width/2, canvas.height/2+40);
				
		//Player 2 Keyboard
		if (player2human) {
			ctx.fillStyle = "#000000";
			ctx.font = "40px StiffStaff, arial, helvetica, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "center";
			ctx.fillText("*Player 2*", canvas.width*3/4, canvas.height/2);
			ctx.fillText("Up: [Up]", canvas.width*3/4, canvas.height/2+50);
			ctx.fillText("Down: [Down]", canvas.width*3/4, canvas.height/2+90);
			ctx.font = "20px StiffStaff, arial, helvetica, sans-serif";
			ctx.fillText("Press [i] for AI", canvas.width*3/4, canvas.height/2+135);
		} else {
			ctx.fillStyle = "#000000";
			ctx.font = "60px StiffStaff, arial, helvetica, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "center";
			ctx.fillText("* A.I. *", canvas.width*3/4, canvas.height/2+45);
			ctx.font = "20px StiffStaff, arial, helvetica, sans-serif";
			ctx.fillText("Player 2 - Press [up] or [down]", canvas.width*3/4, canvas.height/2+135);
		}
				
		//Press Space To Start the game...
		ctx.fillStyle = "#000000";
		ctx.font = "25px StiffStaff, arial, helvetica, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillText("Press Spacebar to start a new game...", canvas.width/2, canvas.height*11/12);
	}

	
	//main game loop
	var mainMenu = function () {
		var now = Date.now();
		var delta = now-before;
		updateMenu();
		renderMenu();
	
		before=now;
	}


	var before = Date.now();
	var menuInterval = setInterval(mainMenu, 1); // 1 = Execute as fast as possible; 1000 = execute every second

}

gameMenu();
