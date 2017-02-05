var alive;

function createPug() {
	alive = true;
	moving = false;
	gamepug.x = 260;
    gamepug.y = 385;
	gamepug.scaleX=.2;
	gamepug.scaleY=.2;
	stage.addChild(gamepug);
}

function pugMoveUp() {
	gamepug.y -= 1;
	stage.update();
}

function pugMoveDown() {
	gamepug.y += 1;
	stage.update();
}

function pugMoveLeft() {
	gamepug.x -= 1;
	stage.update();
}

function pugMoveRight() {
	gamepug.x += 1;
	stage.update();
}