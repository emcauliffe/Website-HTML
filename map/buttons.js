// JavaScript Document
function zoomin(){
	var myImg = document.getElementById("map");
	var currHeight = myImg.clientHeight;
	myImg.style.height = (currHeight + 100) + "px";
}
function zoomout(){
	var myImg = document.getElementById("map");
	var currHeight = myImg.clientHeight;
	if (currHeight <= 150){
		 alert("Maximum zoom-in level reached.");
	} else {
	myImg.style.height = (currHeight - 100) + "px";
	}
}
function reSet(){
	var myImg = document.getElementById("map");
	var currHeight = myImg.clientHeight;
	myImg.style.height = 850+"px";
}