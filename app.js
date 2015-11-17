$(document).ready(function(){
	startNewGame();
	
	$('.container').click(function(e){
		onClick(e, $(this)[0]);
	});
	
	$('.restartBtn').click(startNewGame);
});

function startNewGame(){
	prepareModel();
	prepareView();
	
	handleNewTurn();
}

function gameOver(){
	alert('Game Over!');
	
	startNewGame();
}