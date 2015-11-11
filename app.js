$(document).ready(function(){
	prepare();
	handleNewTurn();
});

function handleNewTurn(){
	makeNewTurn();
	for(var i=0; i<9; i++){
		for(var j=0; j<9; j++){
			var color = getBallFromTable({x:i, y:j});
			if(color != 0){
				var ball = $("<div class='ball'>" + color + "</div>");
				var pos = indexToPos({x: i, y:j});
				ball.css('top', pos.y);
				ball.css('left', pos.x);
				$('.container').append(ball);
			}
		}
	}
}

function indexToPos(index){
	var pair={
		x: index.x * 50 + 10,
		y: index.y * 50 + 10
	}
	return pair;
}