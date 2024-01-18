// Get the modal
var modal = document.getElementById('settings');

// Get the button that opens the modal
var btn = document.getElementById("settingsButton");

// When the user clicks on the button, open the modal 
btn.onclick = function() 
{
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) 
{
    if (event.target == modal) 
	{
        modal.style.display = "none";
    }
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

function toggleLabels(){
	labelsShow = !labelsShow;
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