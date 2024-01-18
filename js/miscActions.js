
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
	clearCanvas();
	drawPolar();
	document.getElementById("mapping").value = "1/(z+" + Math.round(Math.random() * 20 - 10)/10 + "+" + Math.round(Math.random() * 20 - 10)/10 + "*i)";
	setFMap();
	STROKECOLOR = originalStrokeColor;
}