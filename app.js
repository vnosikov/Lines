$(document).ready(function(){
	prepare();	
	handleNewTurn();
	$('.container').click(function(e){
		onClick(e, $(this)[0]);
	});
});

const CELL_SIZE = 50;
const BALL_SIZE = 30;
const BALL_OFFSET = (CELL_SIZE - BALL_SIZE)/2;

var ballActive=null;

function handleNewTurn(){
	newBalls = makeNewTurn();	
	for(var i=0; i< newBalls.length;i++){
		var ind = newBalls[i];
		var color = getBallFromTable(ind);
		var ball = $("<div class='ball ball-" + ind.x + "-"+ ind.y + "'>" + color + "</div>");
		var pos = indexToPos({x: ind.x, y:ind.y});
		ball.css('top', pos.y);
		ball.css('left', pos.x);
		$('.container').append(ball);
	}
	
	checkForRemoval(newBalls);
}

function checkForRemoval(list){
	var forRemoval = [];
	for(i=0; i< list.length;i++){
		forRemoval = forRemoval.concat(checkFor5InLine(list[i]));
	}
	
	for(var i=0;i<forRemoval.length;i++){
		var ball = getBallByIndex(forRemoval[i]);
		if(typeof ball !== 'undefined'){
			ball.remove();
		}
	}
}

function onClick(e, cont){
	var relX = e.pageX - cont.offsetLeft;
    var relY = e.pageY - cont.offsetTop;
	
	var index = posToIndex({x:relX, y:relY});
	
	if(ballActive == null){
		if(getBallFromTable(index) != 0){
			ballActive = index;
			getBallByIndex(index).addClass('active');
		}
	}
		
	else{
		if(getBallFromTable(index) == 0){
			var path = lookForAPath(ballActive, index);
			if(path.length!=0){
				//TODO:Add moving animation
				var oldPos = getBallIndexClassNameByIndex(ballActive);
				var newPos = getBallIndexClassNameByIndex(index);
				var ball = getBallByIndex(ballActive);
				ball.removeClass(oldPos);
				ball.addClass(newPos);
				
				var pos = indexToPos(index);
				ball.css('top', pos.y);
				ball.css('left', pos.x);
				
				moveBall(ballActive, index);
				
				ball.removeClass('active');
				ballActive = null;
				
				checkForRemoval([index]);
				
				handleNewTurn();
			}
		}
		else{
			getBallByIndex(ballActive).removeClass('active');
			ballActive = index;
			getBallByIndex(index).addClass('active');
		}
	}
	
	//handleNewTurn();
}

function indexToPos(index){
	var pair={
		x: index.x * CELL_SIZE + BALL_OFFSET,
		y: index.y * CELL_SIZE + BALL_OFFSET
	}
	return pair;
}

function posToIndex(pos){
	var pair = {
		x: Math.floor(pos.x/CELL_SIZE),
		y: Math.floor(pos.y/CELL_SIZE)
	}
	return pair;
}

function getBallByIndex(index){
	return $('.ball-' + index.x + '-' + index.y);
}

function getBallIndexClassNameByIndex(index){
	return 'ball-' + index.x + '-' + index.y;
}