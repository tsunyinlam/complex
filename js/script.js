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
//
var STROKECOLOR = "#c74440";
//
document.getElementById("mapping").value = "z";

// Left Plane Canvas
var zCanvasDiv = document.getElementById('zPlaneDiv');
var zCanvas = document.createElement('canvas');
if(window.innerWidth > 1000){		
	var canvasMaxHeight1 = window.innerHeight*0.7;
	var canvasMaxHeight2 = window.innerHeight-195;
	var canvasMaxHeight = Math.min(canvasMaxHeight1,canvasMaxHeight2);
} else {
	var canvasMaxHeight = window.innerHeight-100;
}

var FRAMESIZE = Math.round(Math.min(canvasMaxHeight,zCanvasDiv.clientWidth));
zCanvas.setAttribute('width', FRAMESIZE);
zCanvas.setAttribute('height', FRAMESIZE);
zCanvas.setAttribute('id', 'zCanvas');
zCanvasDiv.appendChild(zCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	zCanvas = G_vmlCanvasManager.initElement(zCanvas);
}
var zContext = zCanvas.getContext("2d");	

// Left Plane Data
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickDrag = new Array();

// Genearl Cursor Variables
var paint;
var penMidst = false;
var lineMidst = false;

var lineStarted = false;

var movementAfterCursonDown = false;

var penTool = document.getElementById("penTool");
var lineTool = document.getElementById("lineTool");
var lineStartingPointX, lineStartingPointY;

// General Cursor Functions
function cursormove(cursorX, cursorY) {
	movementAfterCursonDown = true;
	if(penTool.checked) {
		if(paint)
		{
			addClick(cursorX, cursorY, true);
			redraw();
		}
	}
	if(lineTool.checked) {

	}
}

function cursordown(cursorX, cursorY) {
	movementAfterCursonDown = false; 

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
	if(lineTool.checked) {
		if(lineStarted == false) {
			lineStartingPointX = cursorX;
			lineStartingPointY = cursorY;
			lineStarted = true;
		} else {
			addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
			lineStarted = false;
		}
	}
}

function cursorup(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		if ((lineStarted == true) && (distance(lineStartingPointX, lineStartingPointY, cursorX, cursorY) > 10) && (movementAfterCursonDown == true)) {
			addLine(lineStartingPointX, lineStartingPointY, cursorX, cursorY);
			lineStarted = false;
		}
	}
}

function cursorleave(cursorX, cursorY) {
	if(penTool.checked){
		paint = false;
		penMidst = false;
	}
	if(lineTool.checked) {
		lineStarted = false;  
	}	
}
// General Cursor Functions end

// Desktop mouse support
$('#zCanvas').mousemove(function(e) {
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	console.log("mousemove");
	cursormove(mouseX, mouseY);
});

$('#zCanvas').mousedown(function(e){
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;
	
	console.log("mousedown");
	cursordown(mouseX, mouseY);
});

$('#zCanvas').mouseup(function(e) {
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	console.log("mouseup");
	cursorup(mouseX, mouseY);
});

$('#zCanvas').mouseleave(function(e) {
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	console.log("mouseleave");
	cursorleave(mouseX, mouseY);
});
// Desktop mouse support end


// Mobile touch support (all by Copilot!!)
$('#zCanvas').on('touchmove', function(e) {	
	e.preventDefault();
	touchX = e.originalEvent.touches[0].pageX - this.offsetLeft;
	touchY = e.originalEvent.touches[0].pageY - this.offsetTop;

	console.log("touchmove");
	cursormove(touchX, touchY);
}
);

$('#zCanvas').on('touchstart', function(e) {
	e.preventDefault();
	var touchX = e.originalEvent.touches[0].pageX - this.offsetLeft;
	var touchY = e.originalEvent.touches[0].pageY - this.offsetTop;

	console.log("touchstart");
	cursordown(touchX, touchY);
}
);

$('#zCanvas').on('touchend', function(e) {
	e.preventDefault();
	// It seems that touch data cannot be retrieved when touch ends?

	console.log("touchend");
	cursorup(touchX, touchY);
}
);

$('#zCanvas').on('touchcancel', function(e) {
	e.preventDefault();
	
	var touchX = e.originalEvent.touches[0].pageX - this.offsetLeft;
	var touchY = e.originalEvent.touches[0].pageY - this.offsetTop;

	console.log("touchcancel");
	cursorleave(touchX, touchY);
}
);
// Mobile touch support end


var f = function(z){
	return z;
};

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

	redraw();
}

function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow((y2-y1),2) + Math.pow((x2-x1),2));
}

function updateColor(jscolor)
{
	STROKECOLOR = "#" + jscolor;
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playAnimation()
{
	// Process time settings
	startTime = new Date();
	
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

	try{
		for (let index = 0; index <= frames; index++) {
			var time = parseFloat(initialTime) + parseFloat(index)*parseFloat(timeInterval);
			var map = parseTime(t_map, time);
			mapUpdate(map);

			await sleep(1000*delay);
			} 
		endTime = new Date();
		var timeDiff = endTime - startTime;
		timeDiff /= 1000;
		console.log("Animation took " + timeDiff + " seconds");
	}
	catch (err){
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

function addUrlParameters(url, id, value) {
	var newUrl = url;
	if(url.includes("?")){
		newUrl += "&" + id + "=" + value;
	} else {
		newUrl += "?" + id + "=" + value;
	}
	return newUrl;
}

function shareGraph(){
	var inputs, index;
	var url = "https://tobylam.xyz/plotter/";

	inputs = document.getElementsByTagName('input');
	for (index = 0; index < inputs.length; ++index) {
		if(inputs[index].type != "radio"){	
			if ((inputs[index].value != inputs[index].defaultValue)) { 
				if (inputs[index].id != "brushColor") {
					url = addUrlParameters(url, inputs[index].id, inputs[index].value);
				}
			}
		}
	}

	url = addUrlParameters(url, "animate-function", document.getElementById("animate-function").value);
	url = addUrlParameters(url, "clipboard", document.getElementById("clipboard").value);	

	navigator.clipboard.writeText(url);
	alert("Link copied!");
}

function randomize(){

	drawGrid();
	document.getElementById("mapping").value = "1/(z+" + Math.round(Math.random() * 20 - 10)/10 + "+" + Math.round(Math.random() * 20 - 10)/10 + "*i)";
	setFMap();
	STROKECOLOR = originalStrokeColor;
}

function drawGrid(){
	originalStrokeColor = STROKECOLOR;
	// Red
	STROKECOLOR = "#EE6352";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE / 4;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE / 4;
	addLine(x1, y1, x2, y2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 3 / 8;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 3 / 8;
	addLine(x1, y1, x2, y2);

	// Green
	STROKECOLOR = "#59CD90";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 5 / 8;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 5 / 8;
	addLine(x1, y1, x2, y2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 3 / 4;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 3 / 4;
	addLine(x1, y1, x2, y2);

	// Reusing above code but flip x and y coordinates
	// Blue
	STROKECOLOR = "#3FA7D6";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE / 4;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE / 4;
	addLine(y1, x1, y2, x2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 3 / 8;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 3 / 8;
	addLine(y1, x1, y2, x2);

	// Yellow
	STROKECOLOR = "#FAC05E";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 5 / 8;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 5 / 8;
	addLine(y1, x1, y2, x2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 3 / 4;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 3 / 4;
	addLine(y1, x1, y2, x2);

	// Black
	STROKECOLOR = "#000000";
	x1 = FRAMESIZE * 1/4;
	y1 = FRAMESIZE / 2;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE / 2;
	addLine(y1, x1, y2, x2);
	addLine(x1, y1, x2, y2);
	STROKECOLOR = originalStrokeColor;
}

function drawAltGrid(){
	originalStrokeColor = STROKECOLOR;
	// Red
	STROKECOLOR = "#EE6352";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 5 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 5 / 16;
	addLine(x1, y1, x2, y2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 7 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 7 / 16;
	addLine(x1, y1, x2, y2);

	// Green
	STROKECOLOR = "#59CD90";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 9 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 9 / 16;
	addLine(x1, y1, x2, y2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 11 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 11 / 16;
	addLine(x1, y1, x2, y2);

	// Reusing above code but flip x and y coordinates
	// Blue
	STROKECOLOR = "#3FA7D6";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 5 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 5 / 16;
	addLine(y1, x1, y2, x2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 7 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 7 / 16;
	addLine(y1, x1, y2, x2);

	// Yellow
	STROKECOLOR = "#FAC05E";
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 9 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 9 / 16;
	addLine(y1, x1, y2, x2);
	x1 = FRAMESIZE / 4;
	y1 = FRAMESIZE * 11 / 16;
	x2 = FRAMESIZE * 3 / 4;
	y2 = FRAMESIZE * 11 / 16;
	addLine(y1, x1, y2, x2);

	STROKECOLOR = originalStrokeColor;
}

// w plane canvas
var wCanvasDiv = document.getElementById('wPlaneDiv');
wCanvas = document.createElement('canvas');
wCanvas.setAttribute('width', FRAMESIZE);
wCanvas.setAttribute('height', FRAMESIZE);
wCanvas.setAttribute('id', 'wCanvas');
wCanvasDiv.appendChild(wCanvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	wCanvas = G_vmlCanvasManager.initElement(wCanvas);
}
var wContext = wCanvas.getContext("2d");	

function clearCanvas()
{
	clickX = [];
	clickY = [];
	clickDrag = [];
	clickColor = [];
	redraw();
}

function updateBCT()
{
	var newBCT = parseFloat(document.getElementById("bct").value);
	if(!isNaN(newBCT) && newBCT > 1)
	{
		BRANCH_CUT_THRESHHOLD = newBCT;
		document.getElementById("bct").value = newBCT;
	}
	else
	{
		document.getElementById("bct").value = 10;
	}
	redraw();
}

function resetBCT()
{
	BRANCH_CUT_THRESHHOLD = 10;
	document.getElementById("bct").value = 10;
	redraw();
}

function resetRange()
{
	document.getElementById("ZMAXX").value = 2;
	document.getElementById("ZMINX").value = -2;
	document.getElementById("ZMAXY").value = 2;
	document.getElementById("ZMINY").value = -2;
	document.getElementById("WMAXX").value = 2;
	document.getElementById("WMINX").value = -2;
	document.getElementById("WMAXY").value = 2;
	document.getElementById("WMINY").value = -2;
	Z_MAX_X = 2;
	Z_MIN_X = -2;
	Z_MAX_Y = 2;
	Z_MIN_Y = -2;
	W_MAX_X = 2;
	W_MIN_X = -2;
	W_MAX_Y = 2;
	W_MIN_Y = -2;
	redraw();
}

function updateRange()
{
	var zmaxx = parseFloat(document.getElementById("ZMAXX").value);
	var zminx = parseFloat(document.getElementById("ZMINX").value);
	var zmaxy = parseFloat(document.getElementById("ZMAXY").value);
	var zminy = parseFloat(document.getElementById("ZMINY").value);
	var wmaxx = parseFloat(document.getElementById("WMAXX").value);
	var wminx = parseFloat(document.getElementById("WMINX").value);
	var wmaxy = parseFloat(document.getElementById("WMAXY").value);
	var wminy = parseFloat(document.getElementById("WMINY").value);
	if(!isNaN(zmaxx))
	{
		document.getElementById("ZMAXX").value = zmaxx;
		Z_MAX_X = zmaxx;
	}
	else
	{
		document.getElementById("ZMAXX").value = 2;
	}
	if(!isNaN(zminx))
	{
		document.getElementById("ZMINX").value = zminx;
		Z_MIN_X = zminx;
	}
	else
	{
		document.getElementById("ZMINX").value = -2;
	}
	if(!isNaN(zmaxy))
	{
		document.getElementById("ZMAXY").value = zmaxy;
		Z_MAX_Y = zmaxy;
	}
	else
	{
		document.getElementById("ZMAXY").value = 2;
	}
	if(!isNaN(zminy))
	{
		document.getElementById("ZMINY").value = zminy;
		Z_MIN_Y = zminy;
	}
	else
	{
		document.getElementById("ZMINY").value = -2;
	}
	if(!isNaN(wmaxx))
	{
		document.getElementById("WMAXX").value = wmaxx;
		W_MAX_X = wmaxx;
	}
	else
	{
		document.getElementById("WMAXX").value = 2;
	}
	if(!isNaN(wminx))
	{
		document.getElementById("WMINX").value = wminx;
		W_MIN_X = wminx;
	}
	else
	{
		document.getElementById("WMINX").value = -2;
	}
	if(!isNaN(wmaxy))
	{
		document.getElementById("WMAXY").value = wmaxy;
		W_MAX_Y = wmaxy;
	}
	else
	{
		document.getElementById("WMAXY").value = 2;
	}
	if(!isNaN(wminy))
	{
		document.getElementById("WMINY").value = wminy;
		W_MIN_Y = wminy;
	}
	else
	{
		document.getElementById("WMINY").value = -2;
	}
	redraw();
}

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
	//
	zContext.lineJoin = "round";
	zContext.lineWidth = STROKEWIDTH;
			
	for(var i=0; i < clickX.length; i++) 
	{
		zContext.strokeStyle = clickColor[i];
		zContext.beginPath();
		if(clickDrag[i] && i)
		{
			zContext.moveTo(clickX[i-1], clickY[i-1]);
		}
		else
		{
			zContext.moveTo(clickX[i]-1, clickY[i]);
		}
		zContext.lineTo(clickX[i], clickY[i]);
		zContext.closePath();
		zContext.stroke();
	}
	// do the mapping
	wMap();
}

function wMap()
{
	wContext.clearRect(0,0,wCanvas.width,wCanvas.height);
	wContext.lineWidth = AXISWIDTH;
	wContext.strokeStyle = "#000000";
	//axes
	wContext.beginPath();
	wContext.moveTo(0,wCanvas.height/2);
	wContext.lineTo(wCanvas.width,wCanvas.height/2);
	wContext.closePath();
	wContext.stroke();
	// other axis
	wContext.beginPath();
	wContext.moveTo(wCanvas.width/2,0);
	wContext.lineTo(wCanvas.width/2,wCanvas.height);
	wContext.closePath();
	wContext.stroke();
	//
	var zplane = zContext.getImageData(0,0,zCanvas.width,zCanvas.height);
	var data = zplane.data;
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

		var out_x = Math.round(((out_re - W_MIN_X)/(W_MAX_X - W_MIN_X))*wCanvas.width)
		var out_y = Math.round((1-((out_im - W_MIN_Y)/(W_MAX_Y - W_MIN_Y)))*wCanvas.height)

		wContext.lineWidth = STROKEWIDTH;
		wContext.lineJoin = "round";
		if(i != 0)
		{
			wContext.strokeStyle = clickColor[i];
			wContext.beginPath();
			if(clickDrag[i])
			{
				if((distance(out_x,out_y,prevx,prevy)/distance(clickX[i-1],clickY[i-1],clickX[i],clickY[i]))<BRANCH_CUT_THRESHHOLD)
					wContext.moveTo(prevx, prevy);
				else
					wContext.moveTo(out_x, out_y);
			}
			else
			{
				wContext.moveTo(out_x, out_y);
			}
			wContext.lineTo(out_x,out_y);
			wContext.closePath();
			wContext.stroke();
		}
		prevx = out_x;
		prevy = out_y;
	}
}
redraw();
