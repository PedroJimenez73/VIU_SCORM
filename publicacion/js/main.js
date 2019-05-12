// Nav declarations

var burger = document.getElementById("burger");
var menu = document.getElementById("menu-container");

var menuList = document.getElementById("menu-list");
var menuItems = document.querySelectorAll("#menu-list li");

var overlay = document.getElementById("overlay");
var modalOut = document.getElementById("modal-out");
var modalResume = document.getElementById("modal-resume");
var order = 0;

var pages = [
    { title: "Portada", path: "01", show: "no"},
    { title: "Presentación", path: "02", show: "yes"},
    { title: "Mapa Conceptual", path: "03", show: "yes"},
    { title: "1. Introducción a los sistemas de información", path: "04", show: "yes"},
    { title: "2. Modelos de datos", path: "05", show: "yes"},
    { title: "3. Diseño conceptual de bases de datos", path: "06", show: "yes"},
    { title: "4. Diseño en bases de datos relacionales", path: "07", show: "yes"},
    { title: "5. Implantación de sistemas de información", path: "08", show: "yes"},
    { title: "Conclusiones", path: "conclusiones", show: "yes"},
    { title: "Glosario", path: "glosario", show: "yes"},
    { title: "Ejercicios autoevaluativos", path: "ejercicio1", show: "yes"},
    { title: "Ejercicios autoevaluativos", path: "ejercicio2", show: "no"},
    { title: "Ejercicios autoevaluativos", path: "ejercicio3", show: "no"},
    { title: "Ejercicios autoevaluativos", path: "ejercicio4", show: "no"},
    { title: "7. Créditos", path: "creditos", show: "yes"}
]

var currentPage = 0;
var progress = document.getElementById("progress");
var backBtn = document.getElementById('back-btn');
var nextBtn = document.getElementById('next-btn');

$("#content").empty();
$("#content").load("content/" + pages[currentPage].path + "/index.html",function()	{
  $("#page-container1").fadeIn('slow');												  
});

backBtn.style.opacity = 0;
backBtn.style.pointerEvents = 'none';
progress.innerHTML = (currentPage + 1) + '/' + pages.length;

// SCORM declarations

var score = 0;
var avance = 0;
var estado = "";
var intento = [];
// var objetivo = 0;

$(document).ready(function(){

	if (window.parent.document.getElementById('scormtop')) {
      window.parent.document.getElementById('scormtop').style.display = "none";
	}

   	window.onbeforeunload = function() {
		doQuit();
	}

	loadPage();

	score = doGetValue("cmi.score.raw") ? doGetValue("cmi.score.raw") : 0;  // score porcentual del nº pantallas visitadas
 	avance = doGetValue("cmi.location"); // punto de lectura
	estado = doGetValue("cmi.completion_status");	// completed or unknow
	intento = doGetValue("cmi.suspend_data"); // Arrays de 1 ó 0 por página visitada
	// objetivo = doGetValue("cmi.objectives.0.score.raw") // 0 ¿?
	if (avance !== "") {
		currentPage = parseInt(avance);
		toggleResumeModal(); 
	}

	if (intento === "") {
		intento = [];
		for (i = 0; i < pages.length; i++) {
			intento.push("0");
		  }
		intento[0] = "1";
	} else {
    intento = intento.split(",");
  }	

  // Closure for IE
  var funcs = [];

  function createfunc(l) {
      return function() { goTo(l); };
  }

  for (var m = 0; m < pages.length; m++) {
      funcs[m] = createfunc(m);
  }
 
  for (i = 0; i < pages.length; i++) { 
    if (pages[i].show !== "no") {
      var node = document.createElement("li");
      var text = document.createTextNode(pages[i].title);
      node.appendChild(text);
      node.onclick = funcs[i];
      menuList.appendChild(node);
    }
  }


});

// Nav functions

function toggleMenu () {  
    $("#burger").toggleClass("open-menu");
    $("#menu-container").toggleClass("open-menu");
}



function navScreen(j) {
  currentPage += j;
  $("#content").empty();
  $("#content").load("content/" + pages[currentPage].path + "/index.html",function()	{
    $("#page-container1").fadeIn('slow');												  
  });
  progress.innerHTML = (currentPage + 1) + '/' + pages.length;
  intento[currentPage] = "1";
  updateBtn();
}

function goTo(k) {
  currentPage = k + 0;
  $("#content").empty();
  $("#content").load("content/" + pages[currentPage].path + "/index.html",function()	{
    $("#page-container1").fadeIn('slow');												  
  });
  progress.innerHTML = (currentPage + 1) + '/' + pages.length;
  updateBtn();
  toggleMenu();
}

function updateBtn() {
  if (currentPage === 0) {
    backBtn.style.opacity = 0;
    backBtn.style.pointerEvents = 'none';
  } else {
    backBtn.style.opacity = 1;
    backBtn.style.pointerEvents = 'auto';
  }
  if (currentPage === (pages.length - 1)) {
    nextBtn.style.opacity = 0;
    nextBtn.style.pointerEvents = 'none';
  } else {
    nextBtn.style.opacity = 1;
    nextBtn.style.pointerEvents = 'auto';
  }
}

function toggleOutModal () {
  $("#overlay").toggleClass("show");
  $("#modal-out").toggleClass("show");
  setTimeout(function(){
    $("#overlay").toggleClass("visible");
    $("#modal-out").toggleClass("visible");
  }, 20);
}

function toggleResumeModal () {
  $("#overlay").toggleClass("show");
  $("#modal-resume").toggleClass("show");
  setTimeout(function(){
    $("#overlay").toggleClass("visible");
    $("#modal-resume").toggleClass("visible");
  }, 20);
}

// SCORM Functions

	
function logOut () {
	doSetValue("cmi.location", currentPage);
	doCommit();
	doSetValue("cmi.suspend_data", intento);
	doCommit();
	calScore();
	window.close();
}

function resumeCourse() {
	goTo(currentPage);
	toggleMenu();
	toggleResumeModal();
}

function startCourse() {
	goTo(1);
	toggleMenu();
	toggleResumeModal();
}

function calScore() {
	
	var cuenta = 0;

	for (var i = 0;i <intento.length; i++) {
		if(intento[i] == "1") {
			cuenta++
		}
	}

	var puntuacion = Math.floor(cuenta*(100/intento.length));
	
	if(score > puntuacion) {
		puntuacion = score;
	} else {
		score = puntuacion;
	}

	doSetValue("cmi.score.raw", puntuacion);
	doCommit();	

	if(puntuacion == 100) {
		doSetValue("cmi.completion_status","completed");
		doCommit();
	}
	

}



