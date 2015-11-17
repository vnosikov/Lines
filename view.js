const CELL_SIZE = 50;
const BALL_SIZE = 30;
const BALL_OFFSET = (CELL_SIZE - BALL_SIZE)/2;

var ballActive=null;
var isMoving = false;

function prepareView(){
	$('.ball').remove();
}

function handleNewTurn(){
	newBalls = makeNewTurn();	
	for(var i=0; i< newBalls.length;i++){
		var ind = newBalls[i];
		var color = getBallFromTable(ind);
		var ball = $("<div class='ball ball-" + ind.x + "-"+ ind.y + " ballcolor-" + color + "'></div>");
		var pos = indexToPos({x: ind.x, y:ind.y});
		ball.css('top', pos.y);
		ball.css('left', pos.x);
		ball.fadeIn("250");
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
		if(typeof ball !== 'undefitned'){
			ball.fadeOut("500", function(){
				ball.remove();
			});
		}
	}
	return (forRemoval.length>0);
}

function onClick(e, cont){
	if(isMoving) return;
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
				isMoving = true;			
				var oldPos = getBallIndexClassNameByIndex(ballActive);
				var newPos = getBallIndexClassNameByIndex(index);
				var ball = getBallByIndex(ballActive);
				ball.removeClass(oldPos);
				ball.addClass(newPos);
				
				animateBallMovement(function(){
					var pos = indexToPos(index);
					ball.css('top', pos.y);
					ball.css('left', pos.x);
				
					moveBall(ballActive, index);
				
					ball.removeClass('active');
					ballActive = null;
				
					if(!checkForRemoval([index])){
						handleNewTurn();
					}
					isMoving = false;

				});
			}
		}
		else{
			getBallByIndex(ballActive).removeClass('active');
			ballActive = index;
			getBallByIndex(index).addClass('active');
		}
	}
	
	function animateBallMovement(callback){
		for(var i=0;i<path.length; i++){
			var pos = indexToPos(path[i]);
			
			if(i==path.length-1){
				ball.animate({
					top: pos.y,
					left: pos.x
				}, 100, callback);
			}
			
			else{
				ball.animate({
					top: pos.y,
					left: pos.x
				}, 100);
			}
		}
	}
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