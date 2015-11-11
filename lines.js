var tableField=[];
var emptyFields = [];

function prepare(){
	//Prepare Table
	for(var i=0; i<9;i++){
		var line=[];
		for(var j=0; j<9;j++){
			line.push(0);
		}
		tableField.push(line);
	}
	
	//Prepare empty fields array
	for(var i=0; i<9;i++){
		for(var j=0; j<9;j++){
			var pair = {
				x:i, y:j
			};
			emptyFields.push(pair);
		}
	}
}
	

function setBallInTable(pair, color){
	tableField[pair.x][pair.y] = color;
	if(color!=0){
		var ind = emptyFields.indexOf(pair);
		emptyFields.splice(ind,1);
	}
	else{
		emptyFields.push(pair);
	}
}

function getBallFromTable(pair){
	return tableField[pair.x][pair.y];
}

function generateRandomColor(){
	return Math.floor(Math.random()*7+1);
}

function createNewBall(color){
	var index = Math.floor(Math.random()*emptyFields.length);
	var pair = emptyFields[index];
	emptyFields.splice(index, 1);
	
	tableField[pair.x][pair.y] = color;
}

function moveBall(oldLocation, newLocation){
	//Target and source emptiness cell checks
	if(getBallFromTable(newLocation) != 0 || getBallFromTable(oldLocation) == 0){
		return;
	}
	
	var ball = getBallFromTable(oldLocation);
	setBallInTable(oldLocation, 0);
	setBallInTable(newLocation, ball);
}

var nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];

function makeNewTurn(){
	for(var i=0; i<3; i++){
		createNewBall(nextColors[i]);
	}
	
	nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
}