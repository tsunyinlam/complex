function updateColor(jscolor)
{
	STROKECOLOR = "#" + jscolor;
}

function drawGrid(){
	originalStrokeColor = STROKECOLOR;
	// Red
	STROKECOLOR = "#EE6352";
	x1 = frameSize / 4;
	y1 = frameSize / 4;
	x2 = frameSize * 3 / 4;
	y2 = frameSize / 4;
	addLine(x1, y1, x2, y2);
	x1 = frameSize / 4;
	y1 = frameSize * 3 / 8;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 3 / 8;
	addLine(x1, y1, x2, y2);

	// Green
	STROKECOLOR = "#59CD90";
	x1 = frameSize / 4;
	y1 = frameSize * 5 / 8;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 5 / 8;
	addLine(x1, y1, x2, y2);
	x1 = frameSize / 4;
	y1 = frameSize * 3 / 4;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 3 / 4;
	addLine(x1, y1, x2, y2);

	// Reusing above code but flip x and y coordinates
	// Yellow
	STROKECOLOR = "#FAC05E";
	x1 = frameSize / 4;
	y1 = frameSize / 4;
	x2 = frameSize * 3 / 4;
	y2 = frameSize / 4;
	addLine(y1, x1, y2, x2);
	x1 = frameSize / 4;
	y1 = frameSize * 3 / 8;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 3 / 8;
	addLine(y1, x1, y2, x2);

	// Blue
	STROKECOLOR = "#3FA7D6";
	x1 = frameSize / 4;
	y1 = frameSize * 5 / 8;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 5 / 8;
	addLine(y1, x1, y2, x2);
	x1 = frameSize / 4;
	y1 = frameSize * 3 / 4;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 3 / 4;
	addLine(y1, x1, y2, x2);

	// Black
	STROKECOLOR = "#000000";
	x1 = frameSize * 1/4;
	y1 = frameSize / 2;
	x2 = frameSize * 3 / 4;
	y2 = frameSize / 2;
	addLine(y1, x1, y2, x2);
	addLine(x1, y1, x2, y2);
	STROKECOLOR = originalStrokeColor;
}

function drawAltGrid(){
	originalStrokeColor = STROKECOLOR;
	// Red
	STROKECOLOR = "#EE6352";
	x1 = frameSize / 4;
	y1 = frameSize * 5 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 5 / 16;
	addLine(x1, y1, x2, y2);
	x1 = frameSize / 4;
	y1 = frameSize * 7 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 7 / 16;
	addLine(x1, y1, x2, y2);

	// Green
	STROKECOLOR = "#59CD90";
	x1 = frameSize / 4;
	y1 = frameSize * 9 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 9 / 16;
	addLine(x1, y1, x2, y2);
	x1 = frameSize / 4;
	y1 = frameSize * 11 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 11 / 16;
	addLine(x1, y1, x2, y2);

	// Reusing above code but flip x and y coordinates
	// Yellow
	STROKECOLOR = "#FAC05E";
	x1 = frameSize / 4;
	y1 = frameSize * 5 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 5 / 16;
	addLine(y1, x1, y2, x2);
	x1 = frameSize / 4;
	y1 = frameSize * 7 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 7 / 16;
	addLine(y1, x1, y2, x2);

	// Blue
	STROKECOLOR = "#3FA7D6";
	x1 = frameSize / 4;
	y1 = frameSize * 9 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 9 / 16;
	addLine(y1, x1, y2, x2);
	x1 = frameSize / 4;
	y1 = frameSize * 11 / 16;
	x2 = frameSize * 3 / 4;
	y2 = frameSize * 11 / 16;
	addLine(y1, x1, y2, x2);

	STROKECOLOR = originalStrokeColor;
}

function drawPolar(){
	originalStrokeColor = STROKECOLOR;

	// Black
	STROKECOLOR = "#808080";
	addCircle(frameSize/2,frameSize/2,frameSize/8);
	STROKECOLOR = "#000000";
	addCircle(frameSize/2,frameSize/2,frameSize*2/8);

	// Beware the sine angles are flipped due to the canvas coordinate system
	// Red
	STROKECOLOR = "#EE6352";
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*0/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*0/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*1/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*1/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*2/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*2/6)));

	// Yellow
	STROKECOLOR = "#FAC05E";
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*3/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*3/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*4/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*4/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*5/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*5/6)));

	// Green
	STROKECOLOR = "#59CD90";
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*6/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*6/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*7/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*7/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*8/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*8/6)));

	// Blue
	STROKECOLOR = "#3FA7D6";
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*9/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*9/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*10/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*10/6)));
	addLine(frameSize/2,frameSize/2,(frameSize/2)+(frameSize/4*Math.cos(Math.PI*11/6)),(frameSize/2)-(frameSize/4*Math.sin(Math.PI*11/6)));
	STROKECOLOR = originalStrokeColor;
}

function clearCanvas()
{
	clickX = [];
	clickY = [];
	clickDrag = [];
	clickColor = [];
	redraw();
}

function undo()
{
	var undoTrackerLastElement = undoTracker[undoTracker.length - 1] ;
	clickX = clickX.splice(0, undoTrackerLastElement);
	clickY = clickY.splice(0,  undoTrackerLastElement);
	clickColor = clickColor.splice(0, undoTrackerLastElement);
	clickDrag = clickDrag.splice(0,  undoTrackerLastElement);
	undoTracker.pop();
	redraw();
}