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
	makeNewTurn();
	for(var i=0; i<9; i++){
		for(var j=0; j<9; j++){
			var color = getBallFromTable({x:i, y:j});
			if(color != 0){
				var ball = $("<div class='ball ball-" + i + "-"+ j + "'>" + color + "</div>");
				var pos = indexToPos({x: i, y:j});
				ball.css('top', pos.y);
				ball.css('left', pos.x);
				$('.container').append(ball);
			}
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