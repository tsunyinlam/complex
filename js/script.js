var Z_MAX_X = 2;
var Z_MIN_X = -2;
var Z_MAX_Y = 2;
var Z_MIN_Y = -2;
var W_MAX_X = 2;
var W_MIN_X = -2;
var W_MAX_Y = 2;
var W_MIN_Y = -2;
var STROKEWIDTH = 5;
var AXISWIDTH = 1;
var BRANCH_CUT_THRESHHOLD = 10;

var STROKECOLOR = "#c74440";

var labelsShow = true;

document.getElementById("mapping").value = "z";

// Left Plane Canvas
var zCanvasDiv = document.getElementById('zPlaneDiv');
var zCanvas = document.createElement('canvas');
if(window.innerWidth > 1000){		
	var canvasMaxHeight1 = window.innerHeight*0.75;
	var canvasMaxHeight2 = window.innerHeight-195;	
	var canvasMaxHeight = Math.min(canvasMaxHeight1,canvasMaxHeight2);
} else {
	var canvasMaxHeight = window.innerHeight-100;
}

const scale = window.devicePixelRatio; 
var styleFrameSize = Math.round(Math.min(canvasMaxHeight,zCanvasDiv.clientWidth));
var frameSize = Math.floor(styleFrameSize * scale);

zCanvas.setAttribute('width',frameSize);
zCanvas.setAttribute('height',frameSize);
zCanvas.setAttribute('style', 'width: ' + styleFrameSize + 'px; height: ' + styleFrameSize + 'px;');
zCanvas.setAttribute('id', 'zCanvas');

zCanvasDiv.appendChild(zCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	zCanvas = G_vmlCanvasManager.initElement(zCanvas);
}

var zContext = zCanvas.getContext("2d");	

// w plane canvas
var wCanvasDiv = document.getElementById('wPlaneDiv');

wCanvas = document.createElement('canvas');
var wCanvasWidth = frameSize;
var wCanvasHeight = frameSize;
wCanvas.setAttribute('width',wCanvasWidth);
wCanvas.setAttribute('height',wCanvasHeight);
wCanvas.setAttribute('style', 'width: ' + styleFrameSize + 'px; height: ' + styleFrameSize + 'px;');
wCanvas.setAttribute('id', 'wCanvas');

wCanvasDiv.appendChild(wCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	wCanvas = G_vmlCanvasManager.initElement(wCanvas);
}
var wContext = wCanvas.getContext("2d");	

// Left Plane Data
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickDrag = new Array();

var undoTracker = new Array();

var currentX = 0;
var currentY = 0;

// Genearl Cursor Variables
var firstCursorDown = false;
// true if and only if there's been one mousemove followed by a mousedown post reset
// Updates at the end of mousedown / mousemove
var movementAfterCursonDown = false;

// Pen Tool
var paint;
var penMidst = false;
var lineMidst = false;
var penTool = document.getElementById("penTool");

// Line Tool
// Toggle truth variable for mousedown
// Updates at the end of mousedown / mousemove
var lineStarted = false;
var lineTool = document.getElementById("lineTool");
var lineStartingPointX = 0; 
var lineStartingPointY = 0;
var lineStartingClick = 0;

// Circle Tool
// Toggle truth variable for mousedown
// Updates at the end of mousedown / mousemove
var circleStarted = false;
var circleTool = document.getElementById("circleTool");
var circleStartingPointX = 0;
var circleStartingPointY = 0;
var circleStartingClick = 0;

// Marker for Line and Circle Tool
var markerSprite = new Image();
markerSprite.src = "marker.webp";
var markerWidth = 12 * scale;
var markerHeight = 20 * scale;
var markerX = -markerWidth;
var markerY = -markerHeight;

// Global variables for additional drawing tools 
var drawnGrid = false;
var drawnAltGrid = false;
var drawnPolar = false;

function updateCurrent(x, y) {
	currentX = x;
	currentY = y;
}

function updateMarker(x, y) {
	markerX = x - markerWidth/2;
	markerY = y - markerHeight;
	redraw();
}

function hideMarker(){
	markerX = -markerWidth;
	markerY = -markerHeight;
	redraw();
}

function popClick(start) {
	var length = clickX.length;
	for (var i = 0; i < length - start; i++) {
		clickX.pop();
		clickY.pop();
		clickColor.pop();
		clickDrag.pop();
	}
}

function previewUpdate(){
	if(lineStarted){
		// If the line has started, regardless of whether there's been an mouseup, still display the preview line.
		popClick(lineStartingClick);
		addLine(lineStartingPointX, lineStartingPointY, currentX, currentY);
		redraw();
	}
	if(circleStarted) {
		// If the line has started, regardless of whether there's been an mouseup, still display the preview line.
		popClick(circleStartingClick);
		var radius = distance(circleStartingPointX, circleStartingPointY, currentX, currentY);
		addCircle(circleStartingPointX, circleStartingPointY, radius);
		redraw();
	}
}

setInterval(previewUpdate, 16.7);

function resetTools(){
	firstCursorDown = false; 	
	movementAfterCursonDown = false;
	penMidst = false;
	lineMidst = false;
	lineStarted = false;
	circleStarted = false;
	lineStartingPointX = 0; 
	lineStartingPointY = 0;
	circleStartingPointX = 0;
	circleStartingPointY = 0;
	markerX = -markerWidth;
	markerY = -markerHeight;
	redraw();
}

// Mouse Event Handlers
function mousedown(cursorX, cursorY) {
	if(clickX.length != undoTracker[undoTracker.length-1]){
		undoTracker.push(clickX.length);
	}
	firstCursorDown = true;
	if(penTool.checked) {
		if(document.getElementById("autoLinkMin").value < 0.5) {
			document.getElementById("autoLinkMin").value = "1";
			alert("Autolink max distance too small (< 0.5) \nIt has been reseted to 1.");
		}
		paint = true;
		addClick(cursorX, cursorY);
		penMidst = true;
		redraw();
	}
	// lineTool and circleTool
	if(lineTool.checked) {
		if(lineStarted) {
			if(movementAfterCursonDown){
				// Draw line now and reset
				addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
				resetTools();
			} else {
				// Line started (so there's been a down) but there's no movement 
				// So we need to reset and start anew
				resetTools();
				// Even firstCursorDown got set to false, we still need to set it to true
				firstCursorDown = true;
				// Start a new line 
				lineStarted = true;
				lineStartingPointX = cursorX;
				lineStartingPointY = cursorY;
				lineStartingClick = clickX.length;
			}
		} else {
			// Start a new line 
			lineStarted = true;
			lineStartingPointX = cursorX;
			lineStartingPointY = cursorY;
			lineStartingClick = clickX.length;
		}
	}
	if(circleTool.checked) {	
		if(circleStarted) {
			if(movementAfterCursonDown){
				// Draw circle now and reset
				var radius = distance(circleStartingPointX, circleStartingPointY, cursorX, cursorY);
				addCircle(circleStartingPointX, circleStartingPointY, radius);
				resetTools();
			} else {
				// Circle started (so there's been a down) but there's no movement 
				// So we need to reset and start anew
				resetTools();
				// Even firstCursorDown got set to false, we still need to set it to true
				firstCursorDown = true;
				// Start a new circle 
				circleStarted = true;
				circleStartingPointX = cursorX;
				circleStartingPointY = cursorY;
				updateMarker(circleStartingPointX, circleStartingPointY);
				circleStartingClick = clickX.length;
			}
		} else {
			// Start a new circle 
			circleStarted = true;
			circleStartingPointX = cursorX;
			circleStartingPointY = cursorY;
			updateMarker(cursorX, cursorY);
			circleStartingClick = clickX.length;
		}
	}
	movementAfterCursonDown = false;
}

function mousemove(cursorX, cursorY) {
	if(penTool.checked) {
		if(paint)
		{
			addClick(cursorX, cursorY, true);
			redraw();
		}
	}
	if(firstCursorDown){
		movementAfterCursonDown = true;
	}	
}

function mouseup(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		if(movementAfterCursonDown){
			// Draw line now and reset
			previewUpdate();
			addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
			resetTools();
		}
	}
	if(circleTool.checked) {
		if(movementAfterCursonDown){
			// Draw circle now and reset
			previewUpdate();
			var radius = distance(circleStartingPointX, circleStartingPointY, cursorX, cursorY);
			addCircle(circleStartingPointX, circleStartingPointY, radius);
			resetTools();
		}
	}
}

function mouseleave(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		// Reset everything
		resetTools();
	}	
	if(circleTool.checked) {
		// Reset everything
		resetTools();
	}
}

// Touch Event Handlers
function touchstart(cursorX, cursorY) {
	if(clickX.length != undoTracker[undoTracker.length-1]){
		undoTracker.push(clickX.length);
	}
	firstCursorDown = true;
	if(penTool.checked) {
		if(document.getElementById("autoLinkMin").value < 0.5) {
			document.getElementById("autoLinkMin").value = "1";
			alert("Autolink max distance too small (< 0.5) \nIt has been reseted to 1.");
		}
		paint = true;
		addClick(cursorX, cursorY);
		penMidst = true;
		redraw();
	}
	// lineTool and circleTool
	if(lineTool.checked) {
		// Start a new line 
		lineStarted = true;
		lineStartingPointX = cursorX;
		lineStartingPointY = cursorY;
		lineStartingClick = clickX.length;
	}
	if(circleTool.checked) {	
		circleStarted = true;
		circleStartingPointX = cursorX;
		circleStartingPointY = cursorY;
		updateMarker(cursorX, cursorY);
		circleStartingClick = clickX.length;
	}
	movementAfterCursonDown = false;
}

function touchmove(cursorX, cursorY) {
	if(penTool.checked) {
		if(paint)
		{
			addClick(cursorX, cursorY, true);
			redraw();
		}
	}
	if(firstCursorDown){
		movementAfterCursonDown = true;
	}
}

function touchend() {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		if(movementAfterCursonDown){
			// Draw line
			addLine(lineStartingPointX, lineStartingPointY, currentX, currentY);
		}
		resetTools();
	}
	if(circleTool.checked) {
		if(movementAfterCursonDown){
			// Draw circle
			var radius = distance(circleStartingPointX, circleStartingPointY, currentX, currentY);
			addCircle(circleStartingPointX, circleStartingPointY, radius);
		}
		resetTools();
	}
}

// Mouse Event Listeners
$('#zCanvas').mousemove(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);
	console.log("mousemove");
	mousemove(mouseX, mouseY);
});

$('#zCanvas').mousedown(function(e){
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);
	
	console.log("mousedown");
	mousedown(mouseX, mouseY);
});

$('#zCanvas').mouseup(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);

	console.log("mouseup");
	mouseup(mouseX, mouseY);
});

$('#zCanvas').mouseleave(function(e) {
	var mouseX = (e.pageX - this.offsetLeft) * scale;
	var mouseY = (e.pageY - this.offsetTop) * scale;
	updateCurrent(mouseX, mouseY);

	console.log("mouseleave");
	mouseleave(mouseX, mouseY);
});

// Touch Event Listeners
$('#zCanvas').on('touchmove', function(e) {	
	e.preventDefault();
	touchX = (e.originalEvent.touches[0].pageX - this.offsetLeft) * scale;
	touchY = (e.originalEvent.touches[0].pageY - this.offsetTop) * scale;;
	updateCurrent(touchX, touchY);

	console.log("touchmove");
	touchmove(touchX, touchY);
}
);

$('#zCanvas').on('touchstart', function(e) {
	e.preventDefault();
	touchX = (e.originalEvent.touches[0].pageX - this.offsetLeft) * scale;
	touchY = (e.originalEvent.touches[0].pageY - this.offsetTop) * scale;;
	updateCurrent(touchX, touchY);

	console.log("touchstart");
	touchstart(touchX, touchY);
}
);

$('#zCanvas').on('touchend', function(e) {
	e.preventDefault();
	// It seems that touch data cannot be retrieved when touch ends?

	console.log("touchend");
	touchend();
}
);

$('#zCanvas').on('touchcancel', function(e) {
	e.preventDefault();

	console.log("touchcancel");
	touchcancel();
}
);

// Helpful Functions
function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow((y2-y1),2) + Math.pow((x2-x1),2));
}

// Adding vertices to the left plane
function addClick(x, y, dragging)
{
	var clickXPrevious = clickX[clickX.length-1];
	var clickYPrevious = clickY[clickY.length-1];

	if(distance(clickXPrevious, clickYPrevious, x, y)>document.getElementById("autoLinkMin").value && (penMidst || lineMidst)) {
		xMid = (clickXPrevious + x)/2;
		yMid = (clickYPrevious + y)/2;
		addClick(xMid, yMid, true);
		addClick(x, y, true);
	} else {
		clickX.push(x);
		clickY.push(y);
		clickColor.push(STROKECOLOR);
		clickDrag.push(dragging);
	}
}

function addLine(x1, y1, x2, y2) {
	console.log("adding line with addLine");
	console.log("from " + x1 + " " + y1 + " to " + x2 + " " + y2);

	addClick(x1, y1);
	lineMidst = true;
	addClick(x2, y2);
	lineMidst = false;
	
}

function addCircle(x, y, r){
	var circumference = 2 * Math.PI * r;
	var n = circumference / document.getElementById("autoLinkMin").value /1.15;
	addClick(x + r, y);
	penMidst = true;
	for(var i = 0; i < n; i++){
		var angle = i * 2 * Math.PI / n;
		var x0 = x + r * Math.cos(angle + 2 * Math.PI / n);
		var y0 = y + r * Math.sin(angle + 2 * Math.PI / n);
		addClick(x0, y0);
		
	}
	addClick(x + r, y);
	penMidst = false;

}

// Function Plotting
var f = function(z){
	return z;
};

function parse2DFunctions(func)
{
	var func_parsed = func.replaceAll(/x(?!p)/g,"(re(z))");
	var func_parsed_twice = func_parsed.replaceAll("y","(im(z))");
	return func_parsed_twice;
}

function parseTime(func, time){
	var floatTime =  parseFloat(time);
	var bracketedTime =  "(" + floatTime + ")";
	func_parsed = func.replaceAll(/t(?!an)(?<!cbrt)(?<!sqrt)(?<!fact)(?<!cot)(?<!fpart)(?<!ipart)(?<!int)/g, bracketedTime);
	return func_parsed;
}

function combineMap(u,v){
	map = "(" + u + ")+(" + v+ ")*i";
	return map;
}

function finalMapCheck(map){
	if(map.includes("conj")){
		alert("Conjugate is not supported at this moment \nConsider using abs(z)^2/z instead, subjected to your branch cut settings");
	}
}

function setPhiMap()
{
	var u = document.getElementById("real").value;
	var v = document.getElementById("imag").value;

	time = parseFloat(document.getElementById("time").value);
	map = combineMap(parseTime(parse2DFunctions(u),time),parseTime(parse2DFunctions(v),time));
	finalMapCheck(map);

	try{
	mapUpdate(map);
	} catch (err){
		alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
	}
}

function setFMap() {

	var time = document.getElementById("time").value
	var map = document.getElementById("mapping").value;
	map = parseTime(map, time);
	finalMapCheck(map);

	try {
	mapUpdate(map);
	} catch (err){
		alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
	}
}

function mapUpdate(map)
{
	console.log("Mapping " + map );
	var funk = Complex.parseFunction(map,['z']);
	f = function(z){
		return funk(z);
	};
	wMap();
}

// Animation code
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var animationStarted = false;
var animationRunning = false;
var stopAnimation = false;
async function playAnimation()
{
	if(animationStarted || animationRunning){
		stopAnimationCall();
		while(true){
			await sleep(40);
			if(!stopAnimation){
				break;
			}
		}
	}
	animationStarted = true;
	// Process time settings
	
	var initialTime =parseFloat(document.getElementById("initialTime").value);
	var endTime = parseFloat(document.getElementById("endTime").value);
	var totalTimeInterval = endTime - initialTime;

	var fps = parseFloat(document.getElementById("fps").value);
	var elapseTime = parseFloat(document.getElementById("elapseTime").value);

	var frames = fps * elapseTime;
	timeInterval = totalTimeInterval / frames;
	var delay = 1 / fps;

	// Deal with the choice of which function to animate
	if (document.getElementById("animate-function").value == "real") {
		var u = document.getElementById("real").value;
		var v = document.getElementById("imag").value;
		var u_parsed = parse2DFunctions(u);
		var v_parsed = parse2DFunctions(v);
		var t_map = combineMap(u_parsed,v_parsed);}
	else{
		var f = document.getElementById("mapping").value;
		var t_map = f;
	}

	finalMapCheck(t_map);

	animationRunning=true;
	animationStarted=false;

	startTime = new Date();

	try{
		for (let index = 0; index <= frames; index++) {
			var time = parseFloat(initialTime) + parseFloat(index)*parseFloat(timeInterval);
			var map = parseTime(t_map, time);
			mapUpdate(map);
			var frameEndTime = new Date();
			if(frameEndTime - startTime < 1000 * elapseTime * index / frames){
				await sleep(1000 * elapseTime * index / frames - (frameEndTime - startTime));
			}
			if(stopAnimation){
				break;
			}
		} 
		if(stopAnimation){
			console.log("Animation stopped in midst");
		} else {
			endTime = new Date();
			var timeDiff = endTime - startTime;
			timeDiff /= 1000;
			console.log("Animation took " + timeDiff + " seconds");
		}
	}
	catch (err){
		animationRunning = false;
		alert("Invalid Function \nMake sure to use * for multiplication between the variables t, x and y \nMake sure the other settings are valid numbers");
	}
	animationRunning = false;
}

async function stopAnimationCall(){
	if(animationRunning) {
		stopAnimation = true;
		while(true){
			await sleep(40);
			if(!animationRunning){
				break;
			}
		}
		stopAnimation = false;
		var initialTime =parseFloat(document.getElementById("initialTime").value);
		if (document.getElementById("animate-function").value == "real") {
			var u = document.getElementById("real").value;
			var v = document.getElementById("imag").value;
			var u_parsed = parse2DFunctions(u);
			var v_parsed = parse2DFunctions(v);
			var t_map = combineMap(u_parsed,v_parsed);}
		else{
			var f = document.getElementById("mapping").value;
			var t_map = f;
		}
		var map = parseTime(t_map, initialTime);
		mapUpdate(map);
	}
}

var zplane = zContext.getImageData(0,0,zCanvas.width,zCanvas.height);
var data = zplane.data;

function redraw()
{
	zContext.clearRect(0, 0, zContext.canvas.width, zContext.canvas.height); // Clears the zCanvas
	zContext.lineWidth = AXISWIDTH;
	zContext.strokeStyle = "#000000";
	//axes
	zContext.beginPath();
	zContext.moveTo(0,zCanvas.height/2);
	zContext.lineTo(zCanvas.width,zCanvas.height/2);
	zContext.closePath();
	zContext.stroke();
	// other axis
	zContext.beginPath();
	zContext.moveTo(zCanvas.width/2,0);
	zContext.lineTo(zCanvas.width/2,zCanvas.height);
	zContext.closePath();
	zContext.stroke();
	
	// labels
	if(Z_MAX_X == 2 & Z_MIN_X == -2 & Z_MAX_Y == 2 & Z_MIN_Y == -2 & labelsShow){
		zContextLabels();
	}

	zContext.lineJoin = "round";
	zContext.lineWidth = STROKEWIDTH;
	
	for(var i=0; i < clickX.length; i++) 
	{
		if(i==0){
			// If it's the first point, just draw a "point"
			zContext.beginPath();
			zContext.moveTo(clickX[i]-1, clickY[i]);
			zContext.lineTo(clickX[i], clickY[i]);
			zContext.strokeStyle = clickColor[0];
			zContext.stroke();
		} else if (!clickDrag[i]) {
			// Apparently clickDrag is false if the point is at an end point of an line, and true otherwise. Not sure why this is the case.
			// End line and start a new line
			if(clickColor[i] != clickColor[i-1]){
				zContext.strokeStyle = clickColor[i];
			}
			zContext.stroke();
			zContext.moveTo(clickX[i], clickY[i]);
			zContext.beginPath();
		} else {
			// Continue a line
			if(clickColor[i] != clickColor[i-1]){
				zContext.strokeStyle = clickColor[i];
			}
			zContext.lineTo(clickX[i], clickY[i]);
		}
	}

	// Finish the path if there's a line in progress
	zContext.stroke();

	// do the mapping
	wMap();
}

function zContextLabels(){
	zContext.lineWidth = AXISWIDTH*2;

	zContext.font = "30px Arial";
	zContext.textAlign = "right";
	zContext.fillText("0", zCanvas.width/2 - 5, zCanvas.width/2 + 35);
	
	zContext.textAlign = "center";
	zContext.fillText("1", zCanvas.width*3/4, zCanvas.width/2 + 35);
	zContext.beginPath();
	zContext.moveTo(zCanvas.width*3/4,zCanvas.width/2+5);
	zContext.lineTo(zCanvas.width*3/4,zCanvas.width/2-5);
	zContext.closePath();
	zContext.stroke();

	zContext.fillText("1", zCanvas.width*1/4, zCanvas.width/2 + 35);
	zContext.fillText("-", zCanvas.width*1/4-12, zCanvas.width/2 + 35);
	zContext.beginPath();
	zContext.moveTo(zCanvas.width*1/4,zCanvas.width/2+5);
	zContext.lineTo(zCanvas.width*1/4,zCanvas.width/2-5);
	zContext.closePath();
	zContext.stroke();

	zContext.fillText("1", zCanvas.width/2-20, zCanvas.width*1/4+10);
	zContext.beginPath();
	zContext.moveTo(zCanvas.width/2+5, zCanvas.width*1/4);
	zContext.lineTo(zCanvas.width/2-5, zCanvas.width*1/4);
	zContext.closePath();
	zContext.stroke();

	zContext.fillText("1", zCanvas.width/2-20, zCanvas.width*3/4+10);
	zContext.fillText("-", zCanvas.width/2-32, zCanvas.width*3/4+10);
	zContext.beginPath();
	zContext.moveTo(zCanvas.width/2+5, zCanvas.width*3/4);
	zContext.lineTo(zCanvas.width/2-5, zCanvas.width*3/4);
	zContext.closePath();
	zContext.stroke();
}

function wMap()
{
	wContext.clearRect(0,0,wCanvasWidth,wCanvasHeight);
	wContext.lineWidth = AXISWIDTH;
	wContext.strokeStyle = "#000000";
	//axes
	wContext.beginPath();
	wContext.moveTo(0,wCanvasHeight/2);
	wContext.lineTo(wCanvasWidth,wCanvasHeight/2);
	wContext.closePath();
	wContext.stroke();
	// other axis
	wContext.beginPath();
	wContext.moveTo(wCanvasWidth/2,0);
	wContext.lineTo(wCanvasWidth/2,wCanvasHeight);
	wContext.closePath();
	wContext.stroke();

	//labels
	if(W_MAX_X == 2 & W_MIN_X == -2 & W_MAX_Y == 2 & W_MIN_Y == -2 & labelsShow){
		wContextLabels();
	}

	var prevx = -1;
	var prevy = -1;
	
	for(var i = 0; i < clickDrag.length; i++)
	{
		var k = clickX[i]*zCanvas.width + clickY[i];

		var red = data[k];
		var green = data[k+1];
		var blue = data[k+2];
		var alpha = data[k+3];

		var zreal = Z_MIN_X + (Z_MAX_X - Z_MIN_X)*(clickX[i]/zCanvas.width);
		var zimg = Z_MIN_Y + (Z_MAX_Y - Z_MIN_Y)*(1-(clickY[i]/zCanvas.height));
		var inp = Complex(zreal, zimg);
		var out = f(inp);
		var out_re = out.real();
		var out_im = out.imag();

		var out_x = Math.round(((out_re - W_MIN_X)/(W_MAX_X - W_MIN_X))*wCanvasWidth)
		var out_y = Math.round((1-((out_im - W_MIN_Y)/(W_MAX_Y - W_MIN_Y)))*wCanvasHeight)

		wContext.lineWidth = STROKEWIDTH;
		wContext.lineJoin = "round";
		if(i != 0)
		{
			if(clickColor[i] != clickColor[i-1]){
				wContext.strokeStyle = clickColor[i];
			}
			if(!clickDrag[i]){
				// Refer to redraw() for more details
				// End line and start a new line
				wContext.stroke();
				wContext.moveTo(out_x, out_y);
				wContext.beginPath();
			} else {
				// Continue a line + some code inherited about branch cuts which I don't understand
				if((distance(out_x,out_y,prevx,prevy)/distance(clickX[i-1],clickY[i-1],clickX[i],clickY[i]))<BRANCH_CUT_THRESHHOLD)
					wContext.moveTo(prevx, prevy);
				else
					wContext.moveTo(out_x, out_y);
				wContext.lineTo(out_x,out_y);
			}
		}
		prevx = out_x;
		prevy = out_y;
	}

	// Finish the path if there's a line in progress
	wContext.stroke();
}

function wContextLabels(){
	wContext.lineWidth = AXISWIDTH*2;

	wContext.font = "30px Arial";
	wContext.textAlign = "right";
	wContext.fillText("0", wCanvasWidth/2 - 5, wCanvasWidth/2 + 35);
	
	wContext.textAlign = "center";
	wContext.fillText("1", wCanvasWidth*3/4, wCanvasWidth/2 + 35);
	wContext.beginPath();
	wContext.moveTo(wCanvasWidth*3/4,wCanvasWidth/2+5);
	wContext.lineTo(wCanvasWidth*3/4,wCanvasWidth/2-5);
	wContext.closePath();
	wContext.stroke();

	wContext.fillText("1", wCanvasWidth*1/4, wCanvasWidth/2 + 35);
	wContext.fillText("-", wCanvasWidth*1/4-12, wCanvasWidth/2 + 35);
	wContext.beginPath();
	wContext.moveTo(wCanvasWidth*1/4,wCanvasWidth/2+5);
	wContext.lineTo(wCanvasWidth*1/4,wCanvasWidth/2-5);
	wContext.closePath();
	wContext.stroke();

	wContext.fillText("1", wCanvasWidth/2-20, wCanvasWidth*1/4+10);
	wContext.beginPath();
	wContext.moveTo(wCanvasWidth/2+5, wCanvasWidth*1/4);
	wContext.lineTo(wCanvasWidth/2-5, wCanvasWidth*1/4);
	wContext.closePath();
	wContext.stroke();

	wContext.fillText("1", wCanvasWidth/2-20, wCanvasWidth*3/4+10);
	wContext.fillText("-", wCanvasWidth/2-32, wCanvasWidth*3/4+10);
	wContext.beginPath();
	wContext.moveTo(wCanvasWidth/2+5, wCanvasWidth*3/4);
	wContext.lineTo(wCanvasWidth/2-5, wCanvasWidth*3/4);
	wContext.closePath();
	wContext.stroke();
}

// Redraw the canvas to initialize
redraw();
