function getText() {
	var link = document.getElementById(imageName).value;
	alert(link);
	document.getElementById('doc').style.background = 'url('+link+')';
}