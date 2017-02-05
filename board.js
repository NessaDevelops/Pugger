var waves;
var boardLengthSize = 6;
var id, id2, left;
var speed = 1;
var poops = [];
var poopInt = 0;

function createBoard() {
	stage.removeAllChildren;
	waves = [];
	left = true;
	for (var y = 0; y < boardLengthSize; y++) {
		wave.y = y * 50;
		wave.y += 50;
		wave2.y = y * 50;
		wave2.y += 50;
		if (left) {
			wave2.x = -600;
		} else {
			wave2.x = 600;
		}
		left ^= true;
		
		var waveClone = wave.clone();
		var wave2Clone = wave2.clone();
		stage.addChild(waveClone);
		stage.addChild(wave2Clone);

		id = wave.x + "_" + wave.y;
		
		id2 = wave2.x + "_" + wave2.y;
		
		if (waveClone.y % 100 == 0) {
			getWave(waveClone, false, wave2Clone);
		} else {
			getWave(waveClone, true, wave2Clone);
		}
	}
}

function boardMovement() {
	var firstWave;
	var secondWave;
	for (var x = 0; x < waves.length; x++) {
		firstWave = waves[x].wave;
		secondWave = waves[x].wave2;
		
		round = parseInt(firstWave.x);
		if(waves[x].left == true) {
			firstWave.x += speed; 
			secondWave.x += speed;
			if (firstWave.x >= 600) {
				firstWave.x = -600;
			} else if (secondWave.x >= 600) {
				secondWave.x = -600;
			}
		} else {
			firstWave.x -= speed; 
			secondWave.x -= speed;
			if (firstWave.x <= -600) {
				firstWave.x = 600;
			} else if (secondWave.x <= -600) {
				secondWave.x = 600;
			}
		}
	}
}

function addPoops() {
	left = true;
	for (var y = 0; y < boardLengthSize; y++) {
		poopInt += 1;
		poop.y = y * 50;
		poop.y += 50;
		if (left) {
			poop.x = -5;
		} else {
			poop.x = 605;
		}
		left ^= true;
		
		var poopClone  = poop.clone();

		if (poopClone.y % 100 == 0) {
			getPoops(poopClone, false);
		} else {
			getPoops(poopClone, true);
		}
		
    }
}

function poopMovement() {
	var myPoop;
	for (var x = 0; x < poops.length; x++) {
		myPoop = poops[x].poop;
		//round = parseInt(firstWave.x);
		if(poops[x].left == true) {
			myPoop.x += speed; 
			if (myPoop.x >= 600) {
			 	stage.removeChild(myPoop);
				poops.splice(x, 1);
			}
		} else {
			myPoop.x -= speed; 
			if (myPoop.x <= -20) {
				stage.removeChild(myPoop);
				poops.splice(x, 1);
			}
		}
	}
}

function getWave(wave, left, wave2) {
	var len = waves.length;
	if (0 <= len) {
		waves.push({wave: wave, left: left, wave2: wave2});
	} else {
		waves = ({wave: wave, left: left, wave2, wave2});
	}
}

function getPoops(poop, left) {
	var len = poops.length;
	if (0 <= len) {
		poops.push({poop: poop, left: left});
	} else {
		poops = ({poop: poop, left: left});
	}
	stage.addChild(poop);
	stage.update();
}