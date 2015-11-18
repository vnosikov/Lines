var tableField = [];
var emptyFields = [];
var nextColors = [];
var scores=0;


function prepareModel(){
	
	tableField = [];
	emptyFields = [];
	nextColors = [];
	
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
	
	nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
}
	
function setBallInTable(pair, color){
	tableField[pair.x][pair.y] = color;
	if(color!=0){
		for(var i=0;i<emptyFields.length;i++){
			if(emptyFields[i].x == pair.x && emptyFields[i].y == pair.y){
				emptyFields.splice(i,1);
			}
		}
	}
	else{
		emptyFields.push(pair);
	}
}

function getBallFromTable(pair){
	if(!pair || (pair.x == -1 && pair.y == -1)) return -1;
	else return tableField[pair.x][pair.y];
}

function generateRandomColor(){
	return Math.floor(Math.random()*7+1);
}

function createNewBall(color){
	if(emptyFields.length>0){
		var index = Math.floor(Math.random()*emptyFields.length);
		var pair = emptyFields[index];
		emptyFields.splice(index, 1);
	
		tableField[pair.x][pair.y] = color;
		
		return pair;
	}
	else{
		return [];
	}
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

function makeNewTurn(){
	traceArrayInLog("EmptyFields: " + emptyFields.length, emptyFields);
	var newBalls = [];
	for(var i=0; i<3; i++){
		newBalls.push(createNewBall(nextColors[i]));
	}
	
	if(emptyFields.length==0){
		gameOver();
		return [];
	}
	
	nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
	return newBalls;
}

function lookForAPath(source, target){
	var tags = [];
	for(var i=0; i<9;i++){
		var line=[];
		for(var j=0; j<9;j++){
			if(i == source.x && j == source.y){
				line.push(0);
			}
			else{
				line.push(-1);
			}
		}
		tags.push(line);
	}
	
	var step=0;
	var oldFront = [{x:source.x, y:source.y}];
	var newFront = [];
	var adjs = [];
	var found = false, noWay = false;
	while(!found && !noWay){
		adjs=[];
		for (var i=0;i<oldFront.length;i++){
			var pair = oldFront[i];
			adjs = adjs.concat(getAdjacentPairs(pair));
		}
		for(i=0;i<adjs.length;i++){
			pair = adjs[i]
			if(tags[pair.x][pair.y] == -1){
				tags[pair.x][pair.y] = step + 1;
				newFront.push(pair);
			}
		}
		
		if(newFront.length == 0){
			noWay = true;
		}
		
		else if(contains(newFront, target)){
			found = true;
		}
		
		else{
			oldFront = newFront;
			newFront = [];
			step++;
		}
	}
	
	if(noWay){
		console.log('No way found');
		return [];
	}
	else{
		var path = [target];
		var lastPoint = target;
		while(true){
			if(step==0){
				var traceString = "Path from {" + source.x + " " + source.y + "} to {" + target.x + " " + target.y +"}";
				traceArrayInLog(traceString, path);
				
				return path;
			}
			
			var adjs = getAdjacentPairs(lastPoint);
			for (var i=0; i<adjs.length;i++){
				var p = adjs[i];
				if(tags[p.x][p.y] == step){
					path.unshift(p);
					step--;
					lastPoint = p;
					break;
				}
			}
			
			if(i >= adjs.length){
				throw new Error("Can't restore a path between two points");
			}
		}
	}
	
	function contains(a, obj) {
		for (var i = 0; i < a.length; i++) {
			if (a[i].x == obj.x && a[i].y == obj.y) {
				return true;
			}
		}
		return false;
	}
}

function getAdjacentPairs(pair){
	var result=[];
	if(pair.x>0){
		var p = {x:pair.x-1, y:pair.y};
		if(getBallFromTable(p) == 0){
			result.push(p);
		}
	}
	if(pair.x<8){
		var p = {x:pair.x+1, y:pair.y};
		if(getBallFromTable(p) == 0){
			result.push(p);
		}
	}
	if(pair.y>0){
		var p = {x:pair.x, y:pair.y-1};
		if(getBallFromTable(p) == 0){
			result.push(p);
		}
	}
	if(pair.y<8){
		var p = {x:pair.x, y:pair.y+1};
		if(getBallFromTable(p) == 0){
			result.push(p);
		}
	}
	
	return result;
}

function checkFor5InLine(source){
	if(getBallFromTable(source) == 0){
		return [];
	}
	
	var x  = source.x, y = source.y;
	var ballsForRemoval = [], counter;
	
	//Horizontal check
	ballsForRemoval = ballsForRemoval.concat(directionCheck({
		f1: function(cur){if(cur.x>0) return {x:cur.x-1, y:cur.y}; else return {x:-1, y:-1};},
		f2: function(cur){if(cur.x<8) return {x:cur.x+1, y:cur.y}; else return {x:-1, y:-1};}}));
	
	//Vertical check
	ballsForRemoval = ballsForRemoval.concat(directionCheck({
		f1: function(cur){if(cur.y>0) return {x:cur.x, y:cur.y-1}; else return {x:-1, y:-1};},
		f2: function(cur){if(cur.x<8) return {x:cur.x, y:cur.y+1}; else return {x:-1, y:-1};}}));

	//Left-down to Right-up diagonal check
	ballsForRemoval = ballsForRemoval.concat(directionCheck({
		f1: function(cur){if(cur.x>0 && cur.y<8) return {x:cur.x-1, y:cur.y+1}; else return {x:-1, y:-1};},
		f2: function(cur){if(cur.x<8 && cur.y>0) return {x:cur.x+1, y:cur.y-1}; else return {x:-1, y:-1};}}));
	

	//Left-up to Right-down diagonal check
	ballsForRemoval = ballsForRemoval.concat(directionCheck({
		f1: function(cur){if(cur.x>0 && cur.y>0) return {x:cur.x-1, y:cur.y-1}; else return {x:-1, y:-1};},
		f2: function(cur){if(cur.x<8 && cur.y<8) return {x:cur.x+1, y:cur.y+1}; else return {x:-1, y:-1};}}));
		
	if(ballsForRemoval.length>0){
		ballsForRemoval.push(source);
	}	
	
	if(ballsForRemoval.length>0){
		traceArrayInLog("Balls for removal", ballsForRemoval);
	}
	
	removeBalls(ballsForRemoval);
	scores+=2*ballsForRemoval.length;
	return ballsForRemoval;
		
	function directionCheck(f){
		var f1 = f.f1;
		var f2 = f.f2;
		counter = 1;
		var ballsUnderReview = [];
		counter += tryDirection(f1);
		counter += tryDirection(f2);
		if(counter>=5){
			return ballsUnderReview;
		}	
		else return [];
		
		function tryDirection(f){
			var cur  = source;
			var result = 0;
			while(getBallFromTable(f(cur)) == getBallFromTable(source)){
				result++;
				cur = f(cur);
				ballsUnderReview.push(cur);
			}
			return result;
		}
	}
}

function removeBalls(list){
	for(var i=0; i<list.length; i++){
		setBallInTable(list[i], 0);
	}
}

function traceArrayInLog(first, a){
	console.log(first);
	var s ="";
	for(var k=0;k<a.length;k++){
		s += " {" + a[k].x + " " + a[k].y + "},";
	}
	console.log(s);
}