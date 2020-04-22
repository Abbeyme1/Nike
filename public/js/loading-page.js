
	var body = document.querySelector("body");
	var loader = document.getElementById("loadd");
	var image = document.querySelector(".image-loade");
	var load = document.querySelector(".loading-wrapper");
	window.addEventListener("load",(event) =>{
		window.setTimeout(()=> {
			loader.classList.remove("loading-wrapper");
			image.style.opacity = "0";
			loader.remove();
			loader.removeChild(image);
		},2000);
//		loader.classList.remove("loading-wrapper");
	});


