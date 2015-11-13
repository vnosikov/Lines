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
	if(emptyFields.length>0){
		var index = Math.floor(Math.random()*emptyFields.length);
		var pair = emptyFields[index];
		emptyFields.splice(index, 1);
	
		tableField[pair.x][pair.y] = color;
	}
	else{
		throw new Error('Impossible to create new ball when the field is full');
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

var nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];

function makeNewTurn(){
	for(var i=0; i<3; i++){
		createNewBall(nextColors[i]);
	}
	
	nextColors = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
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
				console.log("Path from {" + source.x + " " + source.y + "} to {" + target.x + " " + target.y +"}");
				var s ="";
				for(var k=0;k<path.length;k++){
					s += " {" + path[k].x + " " + path[k].y + "},";
				}
				console.log(s);
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