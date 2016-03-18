//Script to change color of "home" button
//on hovering

function changeColor(x)
{
	x.style.backgroundColor = ("#" + randomColor());
}

function revertColor(x)
{
	x.style.backgroundColor = '#333';
}

function randomColor()
{
	var randomColor = Math.round(
	( Math.random()% 1000));

	if (randomColor < 100)
	{
		randomColor += 100;
	}

	return randomColor;
}
