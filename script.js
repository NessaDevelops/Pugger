var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 450;
var canvas, stage, queue, soundQueue;
var levelFrame, titleScreen, backgroundScreen, instructionScreen, gameoverScreen;
var mainMenu, play, instructionsBtn, pauseSound;
var firstBtn, secondBtn, thirdBtn, coords, level, mySound;
var frameCount = 0;
var square, pug, gamepug;
var POOP_TIMER = 250;
var poopTimer, soundOn;
var poopCont = new createjs.Container();

var gameStates = {
    TITLE:0,
    INSTRUCTIONS:10,
    GAME:20,
    GAME_OVER:30
}

var currentGameState = gameStates.TITLE;
var gameState;

var manifest = [
    {src:"title.png", id:"title"},
    {src:"testbk.png", id:"background"},
    {src:"instructions.png", id:"instructions"},
    {src:"gameover.png", id:"gameover"},
    {src:"levelsign.png", id:"levelsign"},
    {src:"play.png", id:"play"},
    {src:"instructionsBtn.png", id:"instructionsbtn"},
    {src:"mainmenu.png", id:"mainmenu"},
	{src:"pauseSound.png", id:"pauseSound"},
	{src:"waves.png", id:"waves"},
	{src:"poop.png", id:"poop"},
	{src:"Pug.png", id:"pug"},
	{src:"Gamepug.png", id:"gamepug"}
];

var soundManifest = [
	{src:"Crashing-waves.mp3", id:"music"},
	{src:"nextLevel.mp3", id:"nxtlvl"},
	{src:"bark.wav", id:"bark"}
];

function main() {
    init();
}

function init() {
    createCanvas();
    loadFiles();
}

function createCanvas() {
    canvas = document.createElement("canvas");
	canvas.setAttribute("id", "myCanvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var div = document.getElementById("game");
    div.appendChild(canvas);
    
    stage = new createjs.Stage(canvas);
}

function loadFiles() {
    queue = new createjs.LoadQueue(true, "./assets/images/");
    queue.loadManifest(manifest);
	
	createjs.Sound.alternateExtensions = ["mp3"];
	soundQueue = new createjs.LoadQueue(true, "./assets/sounds/");
	soundQueue.installPlugin(createjs.Sound);
	soundQueue.on("complete", loadComplete, this);
	soundQueue.loadManifest(soundManifest);
}

function loadComplete(evt) {
    titleScreen = new createjs.Bitmap(queue.getResult("title"));
    backgroundScreen = new createjs.Bitmap(queue.getResult("background"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructions"));
    gameoverScreen = new createjs.Bitmap(queue.getResult("gameover"));
    levelFrame = new createjs.Bitmap(queue.getResult("levelsign"));
    instructionsBtn = new createjs.Bitmap(queue.getResult("instructionsbtn"));
    play = new createjs.Bitmap(queue.getResult("play"));
    mainMenu = new createjs.Bitmap(queue.getResult("mainmenu"));
	pauseSound = new createjs.Bitmap(queue.getResult("pauseSound"));
	wave = new createjs.Bitmap(queue.getResult("waves"));
	wave2 = new createjs.Bitmap(queue.getResult("waves"));
	poop = new createjs.Bitmap(queue.getResult("poop"));

	mySound = createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.1});
	soundOn = true;
    
	changeState(gameStates.TITLE);	
	document.getElementById("myCanvas").addEventListener("mousemove", function(event) { showCoords(event);});
	
	gamepugSheet = new createjs.SpriteSheet({
        images: [queue.getResult("gamepug")],
        frames: [[0,0,150,209,0,117.5,184.55],[150,0,150,209,0,117.5,184.55],[300,0,150,209,0,117.5,184.55],[150,0,150,209,0,117.5,184.55]],
        animations: {
            stand: [1, 1, "stand"],
            swim: [0, 3, "swim", .5]
        }     
    });
    
    gamepug = new createjs.Sprite(gamepugSheet);
    gamepug.gotoAndPlay("swim");
	
	pugSheet = new createjs.SpriteSheet({
        images: [queue.getResult("pug")],
        frames: [[0,0,354,260,0,197.4,176.5],[354,0,354,262,0,197.4,167.5],[0,262,354,251,0,197.4,162.5],[354,262,354,260,0,197.4,166.5],[0,522,354,262,0,197.4,177.5],[354,522,353,264,0,197.4,172.5],[0,786,363,260,0,206.4,167.5],[363,786,374,252,0,218.4,160.5],[0,1046,380,259,0,224.4,160.5],[380,1046,379,250,0,223.4,162.5]],
        animations: {
            stand: [0, 0, "stand"],
            walk: [0, 9, "walk", .3]
        }     
    });
    
    pug = new createjs.Sprite(pugSheet);
	pug.x = 300;
	pug.y = 280;
	pug.scaleX= .5;
	pug.scaleY= .5;
    pug.gotoAndPlay("walk");
}

function changeState(state) {
    gameState = state;
    
    switch(gameState) {
        case gameStates.TITLE:
            gameState = titleScreen;
			firstBtn = instructionsBtn;
			secondBtn = play;
			thirdBtn = pauseSound;
			lives = 5;
			level = 1;
            break;
        case gameStates.INSTRUCTIONS:
            gameState = instructionScreen;
			firstBtn = mainMenu;
			secondBtn = play;
			thirdBtn = pauseSound;
            break;
        case gameStates.GAME:
            gameState = backgroundScreen;
			firstBtn = null;
			secondBtn = mainMenu;
			thirdBtn = pauseSound;
			frameCount = 0;
			poopTimer = 15;
            break;
        case gameStates.GAME_OVER:
            gameState = gameoverScreen;
			firstBtn = mainMenu;
			secondBtn = null;
			thirdBtn = pauseSound;
			level = 1;
			speed = 1;
			lives = 5;
            break;
    }
    stage.removeChild(currentGameState);
    stage.addChild(gameState);
	addButtons(firstBtn, secondBtn, thirdBtn);
    currentGameState = gameState;
	if (currentGameState == backgroundScreen) {
		createBoard();
		createPug();
		stage.addChild(poopCont);
		showLevel();
		showLives();
	} else {
		stage.removeChild(gamepug);	
		poopCont.removeAllChildren();
		poops = [];
	}
	if (currentGameState != titleScreen) {
		stage.removeChild(pug);
	}
}

 function addButtons(button, button2, button3) {
     stage.enableMouseOver();
     
     play.on("click", function(evt) { changeState(gameStates.GAME); });
	 instructionsBtn.on("click", function(evt) { changeState(gameStates.INSTRUCTIONS); });
	 mainMenu.on("click", function(evt) { changeState(gameStates.TITLE); });
     pauseSound.on("click", function(evt) { changeSound(); });
	 
	 if (button != null) {
		 button.x = 80;
		 button.y = 370;
		 stage.addChild(button);
	 }
	 if (button2 != null) {
		 button2.x = 400;
		 button2.y = 370;
		 stage.addChild(button2);
	 }
	 
	 button3.x = 560;
	 button3.y = 410;
	 stage.addChild(button3);
 }

function changeSound() {
	if (soundOn || soundOn == null) {
		createjs.Sound.stop();
		soundOn = false;
	}
	else {
		mySound.play("music", createjs.Sound.INTERRUPT_NONE);
		soundOn = true;
	}
}

function showCoords(event) {
	stage.removeChild(coords);
	var x = event.pageX - myCanvas.offsetLeft;
	var y = event.pageY - myCanvas.offsetTop;
	var coor = "X: " + x + ", Y: " + y;
	coords = new createjs.Text(coor, "Arial", "#FFF");
	coords.x = 10;
	coords.y = 430;
	stage.addChild(coords);
}

var levelDisplay, levelTxt;

function showLevel() {
	stage.removeChild(levelDisplay);
	levelTxt = "Level: " + level;
	levelDisplay = new createjs.Text(levelTxt, "bold 16px Arial");
	levelDisplay.x = 520;
	levelDisplay.y = 5;
	stage.addChild(levelDisplay);
}

function removeLevel() {
	stage.removeChild(levelDisplay);
}

var lifeDisplay; 

function showLives() {
	stage.removeChild(lifeDisplay);
	lifeDisplay = new createjs.Text("Lives: ", "bold 16px Arial");
	lifeDisplay.x = 5;
	lifeDisplay.y = 5;
	stage.addChild(lifeDisplay);
	
	var rec = new createjs.Shape();
	rec.graphics.beginFill('Black');
	rec.graphics.drawRect(0, 0, 75, 20);
	rec.x = 60;
	rec.y = 5;
	stage.addChild(rec);
	
	var n = 62;
	var m = 2;
	for (var i = 0; i < lives; i++) {
		var life = new createjs.Shape();
		life.graphics.beginFill('White');
		life.graphics.drawRect(0, 0, 10, 16);
		life.x = n;
		life.y = 5 + m;
		
		n += 15;
		
		stage.addChild(life);
	}
}

function removeLives() {
	stage.removeChild(levelDisplay);
}

function mainPugMove() {
	pug.x -= 1;
	stage.update();
}

var timer;
function runGameTimer() {
    frameCount += .1;
	var num = frameCount.toString();
	num = num.slice(0, (num.indexOf("."))+2);
	Number(num);
	timer = new createjs.Text("Time: " + num, "12px Arial", "#FFF");
	timer.x = 10;
	timer.y = 360;
	stage.addChild(timer);
}

var FPS = 30;
function tick(event) {
	//console.log("pooptimer: " +poopTimer+ "POOP_TIMER: "+POOP_TIMER);
	if (currentGameState == backgroundScreen) {
		boardMovement();
		if (poopTimer == 250) {
			console.log("we here");
			addPoops();
		} else if (poopTimer == 0) {
			addPoops();
			poopTimer = POOP_TIMER;
		}
		poopMovement();
		pugMove();
		runGameTimer();
		offMap();
	}
	else if (currentGameState == gameoverScreen) {
		showLevel();
	} else {
		removeLevel();
	}
	if (currentGameState == titleScreen) {
		stage.addChild(pug);
		stage.update();
	} else {
		stage.removeChild(pug);
	}
	poopTimer -= 1;
	stage.update();
	stage.removeChild(timer);
}
createjs.Ticker.addEventListener("tick", tick);
createjs.Ticker.setFPS(FPS);

if( !!(window.addEventListener)) {
    window.addEventListener ("DOMContentLoaded", main);
}else{ 
    window.attachEvent("onload", main);
}

var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_A = 65;
var KEYCODE_S = 83;
var KEYCODE_D = 68;
var KEYCODE_W = 87;

function handleKeyDown(evt) {
    if(!evt) { 
		var evt = window.event; 
	}
	if (currentGameState == backgroundScreen) {
		switch(evt.keyCode) {
			case KEYCODE_LEFT:
				pugMoveLeft();
				return false;
			case KEYCODE_RIGHT:
				pugMoveRight();
				return false;
			case KEYCODE_UP:    
				pugMoveUp();
				return false;
			case KEYCODE_DOWN:  
				pugMoveDown();
				return false;
			case KEYCODE_A:
				pugMoveLeft();
				return false;
			case KEYCODE_S:  
				pugMoveDown();
				return false;
			case KEYCODE_D:  
				pugMoveRight();
				return false;
			case KEYCODE_W:  
				pugMoveUp(); 
				return false;
		}
	}
}

function handleKeyUp(evt) {
    if(!evt) { 
		var evt = window.event; 
	}
    switch(evt.keyCode) {
        case KEYCODE_LEFT:	
			break;
        case KEYCODE_RIGHT: 
			break;
        case KEYCODE_UP:	
			break;
        case KEYCODE_DOWN:	
			break;
		case KEYCODE_A:  
			break;
		case KEYCODE_S:  
			break;
		case KEYCODE_D:  
			break;
		case KEYCODE_W:  
			break;
    }
}

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;