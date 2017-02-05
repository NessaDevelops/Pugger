var current_square;
var lives = 5;
var moving = false;

function dead() {
	createjs.Sound.play("bark");
	gamepug.x = 260;
	gamepug.y = 385;
	lives -= 1;
	showLives();
	if (lives == 0) {
		alive = false;
		gameOver();
	}
}

function pugMove() {
	var pugLeft = gamepug.x - 20;
	var pugRight = gamepug.x;
	var pugBot = gamepug.y;
	var pugTop = gamepug.y - 35;
	
	for (var x = 0; x < poops.length; x++) {
		var collision = false;
		
		var myPoop = poops[x].poop;
		var poopLeft = myPoop.x - 30;
		var poopRight = myPoop.x;
		var poopBot = myPoop.y + 45;
		var poopTop = myPoop.y + 15;
		if (pugLeft >= poopLeft && pugLeft <= poopRight) {
			if (gamepug.y > myPoop.y) {
				if (pugTop <= poopBot) {
					collision = true;
				} else {
					if (pugBot <= poopTop) {
						collision = true;
					}
				}
			}
		}
		if (collision) {
			dead();
			moving = false;
		} else {
			moving = true;
		}
	}
	if (gamepug.y <= 350) {
		moving = true;
	} else {
		moving = false;
	}
	if(moving) {
		if (300 >= gamepug.y && gamepug.y > 250) {
			gamepug.x += speed;
		} else if(200 >= gamepug.y && gamepug.y > 150) {
			gamepug.x += speed;
		} else if( 100 >= gamepug.y && gamepug.y > 50) {
			gamepug.x += speed;
		} else {
			gamepug.x -= speed;
		}
	}
	if (gamepug.y <= 50) {
		nextLevel();
		moving = false;
	}
}

function offMap() {
	if (gamepug.x < -15 || gamepug.x > 575) {
		moving = false;
		dead();
	}
	if (gamepug.y > 450) {
		gamepug.x = 260;
		gamepug.y = 375;
	}
}

function nextLevel() {
	createjs.Sound.play("nxtlvl");
	level += 1;
	speed += .1;
	POOP_TIMER -= 1;
	stage.removeChild(gamepug);	
	poopCont.removeAllChildren();
	poops = [];
	changeState(gameStates.GAME);
}

function gameOver() {
	changeState(gameStates.GAME_OVER);
}