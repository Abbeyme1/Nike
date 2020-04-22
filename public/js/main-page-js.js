var blueBtn = document.getElementById("blue");
var blackBtn = document.getElementById("black");
var imagee = document.getElementById("mainView");
var sidebar = document.getElementById("sidenav");
var top = document.querySelectorAll("#top-nav li .topp");


blueBtn.onclick = function changeContent(){
	imagee.classList.add("semibodyblue");
	sidenav.classList.add("sidenav-blue");
}

blackBtn.onclick = function c(){
	imagee.classList.remove("semibodyblue");
	sidenav.classList.remove("sidenav-blue");
}