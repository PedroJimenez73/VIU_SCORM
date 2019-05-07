
//////////Inicializacion de variables y array de pantallas
var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var avance = 0;
var avance_total = 0;
var estado="";
var score= 0;
var intento= 0;
var avance_j= 0;
var estado_j = 0;
var nombre_j = 0;
var leccion_j = 0;
var score_j = 0;
var intento_j=0;
var objetivo = 0;
var TemaActual = 0;
var pantalla = 0;
var escena = 0;
var tit = "";
var ayuda_aux = 0;
var boca_sig = "";
var contador = 1;
var ini_indice = 0;
var ini_docs = 0;
var menu=0;
var izq = 0;
var arriba = 0;
var versionIE=0;
var idioma='es';
var sonido=1;
var masInfo=0;
var tIndice = new Array();
var arrayBotones = new Array();
var tTitulos = new Array();
var tIndiceScorm = new Array();
var tIndiceNumeros = new Array();
var n = 0;
var t = 0;
var i = 0;
var secuencial=0;
var cuentaAtras;
var pestanas;

var mostrar_grafico1 = false;
var mostrar_grafico2 = false;
var mostrar_grafico3 = false;
var mostrar_grafico4 = false;
var mostrar_grafico5 = false;
var mostrar_grafico6 = false;

$(document).ready(function(){

	
	
	if (window.parent.document.getElementById('scormtop')) {
      window.parent.document.getElementById('scormtop').style.display = "none";
	}
   	 window.onbeforeunload = function()
	{
		doQuit();
	}
	loadPage();//Inicialización de SCORM
///////////////////////////////////////////////////////
	score=doGetValue("cmi.score.raw");
    avance_j=doGetValue("cmi.location");
	estado=doGetValue("cmi.completion_status");	
	intento=doGetValue("cmi.suspend_data");
	objetivo = doGetValue("cmi.objectives.0.score.raw")
	
///////////////////////////////////////////////	
	
   //Carga índice desde xml y lo genera
	$.get("xml/indice.xml", function (xml) {
    	$(xml).find("capitulo").each(function () {
			var numeroPaginas = $(this).find("pagina").length;
			var nombreCap = $(this).attr("titulo");
			//$("#listaInd").append("<li id='menu"+i+"' class='menu'>"+nombreCap+"</li>");
			if(numeroPaginas > 0)
			{
				$("#listaInd").append("<ul id='submenu"+n+"' class='listaNueva submenu'></ul>");
				$(this).find("pagina").each(function()
				{
					if($(this).attr("mostrar") == "si")
					{
						var subTitulo = $(this).attr("titulo");
						var numeroCap = $(this).attr("numero");
						if(numeroCap == "01" || numeroCap == "02" || numeroCap == "03" || numeroCap == "04" || numeroCap == "05" || numeroCap == "06"){
							$("#submenu"+n).append("<li id='btn"+t+"' onclick='actTema("+t+")' class='btnSubMenu pant_"+numeroCap+"'><span class='titulo_pant'>"+subTitulo+"</span></li>");
						}else{
							numeroCap_otro = numeroCap.slice(0,-1);
							if(numeroCap_otro.indexOf('.') != -1){
								numeroCap_otro = numeroCap_otro.split(".").join("_");  
								$("#submenu"+n).append("<li id='btn"+t+"' onclick='actTema("+t+")' class='btnSubMenu sub_titulo grupo"+numeroCap_otro+"'><span class='num_titulo_pant'>"+numeroCap+"</span><span class='titulo_pant'>"+subTitulo+"</span></li>");
							}else{
							$("#submenu"+n).append("<li id='btn"+t+"' onclick='actTema("+t+")' class='btnSubMenu grupo"+numeroCap_otro+"'><span class='num_titulo_pant'>"+numeroCap+"</span><span class='titulo_pant'>"+subTitulo+"</span></li>");
							}
						}
						
						
							tIndice.push($(this).attr("ruta"));
							tIndiceScorm.push($(this).attr("indice"));
							tIndiceNumeros.push($(this).attr("numero"));
							arrayBotones.push("btn"+t);
							tTitulos.push(nombreCap);
							$("#btn"+t).click(function(){
								cargarPantalla(this);
							});
							t++;
						
					}
					else
					{
						tIndice.push($(this).attr("ruta"));
						tIndiceScorm.push($(this).attr("indice"));
						tIndiceNumeros.push($(this).attr("numero"));
						arrayBotones.push("btn"+t);
						tTitulos.push(nombreCap);
						t++;
						
					}
					
				});
				$("#menu"+i).click(function()
				{
					var submenus = document.getElementsByClassName("submenu");										
					for(var s = 0;s<submenus.length;s++)
					{					
						$("#submenu"+s).css("display","none");						
					}									
					$(this).next("ul.submenu").slideToggle(300,function(){generarPopupInt();});
						
							
				});				
				n++;	
				
			}
			else
			{
				tIndice.push($(this).attr("ruta"));
				tIndiceScorm.push($(this).attr("indice"));
				tIndiceNumeros.push($(this).attr("numero"));
				arrayBotones.push("menu"+i);
				$("#menu"+i).click(function()
				{
					cargarPantalla(this);
					var submenus = document.getElementsByClassName("submenu");										
					for(var s = 0;s<submenus.length;s++)
					{					
						$("#submenu"+s).css("display","none");						
					}
				});
				tTitulos.push(nombreCap);
			}
            i++;
    	});	
		if(objetivo=="")
		{
			objetivo=0;
		}
		if (avance_j==""){
			avance_j=0;
		}
		if (intento==""){
			intento="0";
			for(i=1;i<tIndice.length;i++)
			{
				
				intento = intento+",0"	
						
			}		
		}
		
		if (score==""){
			score=0;
		}
		TemaActual = avance_j;
		avance_total = avance_j;
		if(TemaActual == 0)
		{
			guardarPosicion();
			calcularPuntacion();
			cargarPagina(tIndice[TemaActual]);
		}
		else
		{
			mostrarRetomar();
		}
		
		
	});	
	
   	
	
	/*$('#btnIndice').click(function(){
		generarPopupInt();
		$('#indice').fadeIn('slow');
		$('.overlay').fadeIn('slow');
		$('.overlay').height($(window).height());
		$('body').css('overflow','hidden');
		return false;
	});*/
	
	$('#btnIndice').click(function(){
		$('#btnIndice').toggleClass("abierto");
		$('#contenedor_indice').toggleClass('mostrado');
		$('#contenido').toggleClass('mostrar_indice_cont');
		$('#cabecera').toggleClass('mostrar_indice_cab');
		ajustarResolucion();
	});

	$('#listaInd').click(function(){
		$('#btnIndice').toggleClass("abierto");
	});
	
	$('#cerrar-indice').click(function(){
		$('#contenedor_indice').toggleClass('mostrado');
		$('#contenido').toggleClass('mostrar_indice_cont');
		$('#cabecera').toggleClass('mostrar_indice_cab');
		ajustarResolucion();
	});
	

	$('#btnAyuda').click(function(){
		generarPopupInt();
		$('#ayuda').fadeIn('slow');
		$('.overlay').fadeIn('slow');
		$('.overlay').height($(window).height());
		$('body').css('overflow','hidden');
		return false;
	});
	$('#btnDocumentos').click(function(){
		generarPopupInt();
		$('#documentos').fadeIn('slow');
		$('.overlay').fadeIn('slow');
		$('.overlay').height($(window).height());
		return false;
	});
	
	$('.popup .close').click(function(){
		cerrarPopups();
	});
	
	//$("#contenido").mCustomScrollbar();
	
	$(window).scroll(function(){
			var windowHeight = $(window).scrollTop();

			if ( $("#grafico1").length > 0 ){
				var grafico1 = $("#grafico1").offset();
				grafico1 = grafico1.top;
				if(windowHeight >= grafico1 - 600 && mostrar_grafico1 == false){
					mostrar_grafico1 = true;
					document.getElementById('grafico1').contentWindow.location.reload(true);
					$("#grafico1").animate({opacity: 1}, 1000);
				}else if(windowHeight <= grafico1 - 600 && mostrar_grafico1 == true){
					$("#grafico1").animate({opacity: 0});
					mostrar_grafico1 = false;
				}
			}
			if ( $("#grafico2").length > 0 ){
				var grafico2 = $("#grafico2").offset();
				grafico2 = grafico2.top;
				if(windowHeight >= grafico2 - 600 && mostrar_grafico2 == false){
					mostrar_grafico2 = true;
					document.getElementById('grafico2').contentWindow.location.reload(true);
					$("#grafico2").animate({opacity: 1}, 1000);
				}else if(windowHeight <= grafico2 - 600 && mostrar_grafico2 == true){
					$("#grafico2").animate({opacity: 0}, 0);
					mostrar_grafico2 = false;
				}
			}
			if ( $("#grafico3").length > 0 ){
				var grafico3 = $("#grafico3").offset();
				grafico3 = grafico3.top;
				if(windowHeight >= grafico3 - 600 && mostrar_grafico3 == false){
					mostrar_grafico3 = true;
					document.getElementById('grafico3').contentWindow.location.reload(true);
					$("#grafico3").animate({opacity: 1}, 1000);
				}else if(windowHeight <= grafico3 - 600 && mostrar_grafico3 == true){
					$("#grafico3").animate({opacity: 0}, 0);
					mostrar_grafico3 = false;
				}
			}
			if ( $("#grafico4").length > 0 ){
				var grafico4 = $("#grafico4").offset();
				grafico4 = grafico4.top;
				if(windowHeight <= grafico4 - 600 && mostrar_grafico4 == false){
					mostrar_grafico4 = true;
					document.getElementById('grafico4').contentWindow.location.reload(true);
					$("#grafico4").animate({opacity: 1}, 1000);
				}else if(windowHeight >= grafico4 - 600 && mostrar_grafico4 == true){
					$("#grafico4").animate({opacity: 0}, 0);
					mostrar_grafico4 = false;
				}
			}
			if ( $("#grafico5").length > 0 ){
				var grafico5 = $("#grafico5").offset();
				grafico5 = grafico5.top;
				if(windowHeight >= grafico5 - 600 && mostrar_grafico5 == false){
					mostrar_grafico5 = true;
					document.getElementById('grafico5').contentWindow.location.reload(true);
					$("#grafico5").animate({opacity: 1}, 1000);
				}else if(windowHeight <= grafico5 - 600 && mostrar_grafico5 == true){
					$("#grafico5").animate({opacity: 0}, 0);
					mostrar_grafico5 = false;
				}
			}
			if ( $("#grafico6").length > 0 ){
				var grafico6 = $("#grafico6").offset();
				grafico6 = grafico6.top;
				if(windowHeight >= grafico6 - 600 && mostrar_grafico6 == false){
					mostrar_grafico6 = true;
					document.getElementById('grafico6').contentWindow.location.reload(true);
					$("#grafico6").animate({opacity: 1}, 1000);
				}else if(windowHeight <= grafico6 - 600 && mostrar_grafico6 == true){
					$("#grafico6").animate({opacity: 0}, 0);
					mostrar_grafico6 = false;
				}
			}

			/*console.log(grafico1+" "+windowHeight)*/
	});
	
});
function calcularPuntacion()
{
	
	var pantallas = new Array();
	var cuenta = 0;
	pantallas = intento.split(",");	
	for(var i = 0;i<pantallas.length;i++)
	{
		if(pantallas[i] == "1")
		{
			cuenta++
		}
	}
	var puntuacion = Math.floor(cuenta*(100/pantallas.length));
	
	if(score > puntuacion)
	{
		puntuacion = score;
	}
	else
	{
		score = puntuacion;
	}
	if(puntuacion == 100)
	{
		doSetValue("cmi.completion_status","completed");
		doCommit();
	}
	
	doSetValue("cmi.score.raw",puntuacion);
	doCommit();
	
	
}
function guardarPosicion()
{
	
	//alert(TemaActual);
	var pantallas = new Array();
	pantallas = intento.split(",");	
	pantallas[TemaActual] = "1";	
	intento = pantallas.join();	
	doSetValue("cmi.suspend_data",intento);
	doCommit();
    doSetValue("cmi.location",TemaActual);
	doCommit();
	
}

function mostrarCapa(id){
	$('.capa').fadeOut(1);
	$(id).fadeIn(5,function(){generarPopupInt();});
	
}
function ocultarCapa(id){
	$(id).fadeOut(400);
}

function ayudaCapas(id,btn){
	mostrarCapa(id);
	$('#btnInterfaz').removeClass('activa');
	$('#btnRecursos').removeClass('activa');
	btn='#'+$(btn).attr('id');
	$(btn).addClass('activa');
}
function cerrarPopups(){
	$('.popup').fadeOut('slow');
	$('.overlay').fadeOut('slow');
	$('body').css('overflow','auto');
	return false;
}

function cargarPantalla(id)
{
	for(var i = 0;i<arrayBotones.length;i++)
	{
		var nombre = arrayBotones[i]
		if(id.id == nombre)
		{
			if(secuencial == 0)
			{
				TemaActual=i;
				cargarPagina(tIndice[i]);			
				guardarPosicion();
				calcularPuntacion();	
			}
			else
			{
				if(i<=avance_j)
				{
					TemaActual=i;
					cargarPagina(tIndice[i]);			
					guardarPosicion();
					calcularPuntacion();
				}
			}
			
			
		}
	}	
}

function cargarPantalla_0(id)
{
	for(var i = 0;i<arrayBotones.length;i++)
	{
		var nombre = arrayBotones[i]
		if(id == nombre)
		{
			if(secuencial == 0)
			{
				TemaActual=i;
				cargarPagina(tIndice[i]);			
				guardarPosicion();
				calcularPuntacion();	
			}
			else
			{
				if(i<=avance_j)
				{
					TemaActual=i;
					cargarPagina(tIndice[i]);			
					guardarPosicion();
					calcularPuntacion();
				}
			}
			
			
		}
	}	
}

function cargarPagina(ruta){
	
		mostrar_grafico1 = false;
		mostrar_grafico2 = false;
		mostrar_grafico3 = false;
		mostrar_grafico4 = false;
		mostrar_grafico5 = false;
		mostrar_grafico6 = false;
	
		$('#contenedor_indice').removeClass('mostrado');
		$('#contenido').removeClass('mostrar_indice_cont');
		$('#cabecera').removeClass('mostrar_indice_cab');
	
		var activaindice = tIndiceNumeros[TemaActual];

		if(activaindice == "01"){
			$(".btnSubMenu").removeClass("estas_lista");
			$(".pant_01").addClass("estas_lista");
		}else if(activaindice == "02"){
			$(".btnSubMenu").removeClass("estas_lista");
			$(".pant_02").addClass("estas_lista");
		}else if(activaindice == "03"){
			$(".btnSubMenu").removeClass("estas_lista");
			$(".pant_03").addClass("estas_lista");
		}else if(activaindice == "04"){
			$(".btnSubMenu").removeClass("estas_lista");
			$(".pant_04").addClass("estas_lista");
		}else if(activaindice == "05"){
			$(".btnSubMenu").removeClass("estas_lista");
			$(".pant_05").addClass("estas_lista");
		}else{
			activaindice = activaindice.slice(0,-1);
			activaindice = activaindice.split(".").join("_");  
			$(".btnSubMenu").removeClass("estas_lista");
			$(".grupo"+activaindice).addClass("estas_lista");
		}
	
	
		masInfo=0;
		//$("#player").load(tIndiceEs[TemaActual].html,function()	{	
		$("#player").empty();
		$("#player").load(ruta,function()	{
			$("#contenedor-curso").fadeIn('slow');	
			cerrarPopups();
			ajustarResolucion();												  
		});
/*		tit = tIndiceEs[TemaActual].titulo;*/
		pantalla = parseInt(TemaActual) + 1;
		$("#avancePantallas").remove();
		$("#totalPantallas").remove();
		$("#titulo_modulo").empty();		
		$("#progreso").append("<span id='avancePantallas'>"+pantalla+" / "+"</span>");
		$("#progreso").append("<span id='totalPantallas'>"+tIndice.length+"</span>");	
		$("#titulo_modulo").append(tTitulos[TemaActual]);
		
		
}
function pasarpagina()
{		 
	cargarPagina(tIndice[TemaActual]);
	$("html, body").animate({ scrollTop: 0 }, 500);
	//crear_indice();			
	//actualizarTexto();	
}
function paginaAtras()
{		 
	cargarPagina(tIndice[TemaActual]);
	$("html, body").animate({ scrollTop: 0 }, 500);
	//crear_indice();			
	//actualizarTexto();	
}

function generarPopupInt() {
	/*var alto = window.innerHeight;
	var ancho = window.innerWidth;
	var altoCabecera = $("#cabecera").height();
	var altoBotonera = $("#pie").height();
	alto = alto - altoBotonera - altoCabecera;
	var alto1=alto-100;
	var alto2=alto-150;*/
	var popup = document.getElementsByClassName("popup");
	/*for(var i = 0;i<popup.length;i++) {
		//$(popups[i]).css({"max-width":700,"width":"90%"})
		var anchoPop = $(popup[i]).width();		
		var altoPop = $(popup[i]).height();
		var id=popup[i].id;
		
		$(popup[i]).css({"max-height":(alto),"max-width":(ancho-150)});	
		$('#'+id+' .contenidoPopup').css({"max-height":(alto2),"max-width":(ancho-150),'padding':'10px'});	
		
		if(altoPop<($('#'+id+' .contenidoPopup').height())){
			altoPop=$('#'+id+' .contenidoPopup').height()+30;
		}
		
		var margenIz = -((anchoPop/2)+20)+"px";
		var margenTop = -(altoPop/2)+"px";
		margenIz = margenIz.toString();
		margenTop = margenTop.toString();
		//$(popups[i]).css({"top":posY+"%","left":posX+"%"})
		$(popup[i]).css({"margin-left":margenIz,"margin-top":margenTop,"top":"50%","left":"50%","height":"auto"});
	}*/
	$('.overlay').height($(window).height());
}


function resizeIframe(obj) {
	if(document.getElementById(obj)){
		document.getElementById(obj).style.height = document.getElementById(obj).contentWindow.document.body.scrollHeight + 'px';
	}
}	

function altura_iframe(){
		var numero_iframes = $('iframe').length;
		for (var i = 1; i <= numero_iframes; i++) {
			var altura = $("#grafico"+i).contents().find('#canvas').height();
			altura = altura + 50;
			$("#grafico"+i).height(altura+"px");
		}
	}

function ajustarResolucion() {

	clearTimeout(cuentaAtras);
	
	cuentaAtras=setTimeout(function()
	{
		ajustarSlide();
		generarPopupInt();
		generarPopup();
		// resetAltura("resaltado1");
		
		// var heightPest2=$('.pestLaterales .contPest').height();
		// pestanas=$(".pestanias li").size();
		// if(heightPest2<(30*pestanas)){
		// 	heightPest2=30*pestanas;
		// }
		// $('.pestLaterales .pestanias li').height(heightPest2/pestanas);
		// $('.pestLaterales .pestanias li').css('line-height',heightPest2/pestanas+'px');
		// $('.pestLaterales > ul').css('height',(heightPest2+(pestanas+5))+'px');		
		
		clearTimeout(cuentaAtras);		
		
	},500);
	
	/*generarPopupInt();
	generarPopup();*/
	
	
	resizeIframe('iframe_ejercicio');
	altura_iframe();
	
	
	
}
function mostrarRetomar()
{
	$('.overlay').fadeIn('slow');
	$("#retomar").fadeIn(500);	
}

function siRetomar()
{
	cargarPagina(tIndice[TemaActual]);
	guardarPosicion();
	calcularPuntacion();
	btnAtras.classList.remove("ocultar");
	$("#contenido").fadeIn(500);
	$('.overlay').fadeOut('slow');
	$("#retomar").fadeOut(200);		
}

function noRetomar()
{
	TemaActual = 0;
	cargarPagina(tIndice[TemaActual]);
	guardarPosicion();
	calcularPuntacion();
	$("#contenido").fadeIn(500);
	$('.overlay').fadeOut('slow');
	$("#retomar").fadeOut(200);	
}

function mostrarSalir()
{
	$('.overlay').fadeIn('slow');
	$("#salir").fadeIn(500);	
}

function siSalir()
{
	window.close();		
}

function noSalir()
{
	$("#contenido").fadeIn(500);
	$('.overlay').fadeOut('slow');
	$("#salir").fadeOut(200);	
}

/* Acordeón */

// var anterior = "";
// function acordeon(id){
// 	content=$(id+' .content');
	
// 	heightContent=($(content).height()+70)+'px';
// 	if((anterior!="") && (anterior!=id))
// 	{
// 		if($(anterior+" .content").css("display")!="none")
// 		{
// 			$(anterior+" .content").slideToggle(500);
// 		}
// 		$(anterior+' > h3 > span:first-child').addClass('icon-plus');
// 		$(anterior+' > h3 > span:first-child').removeClass('icon-minus');
// 		$(anterior+' > h3 > .cerrarInfo > span').removeClass('icon-arrow-up8');
// 		$(anterior+' > h3 > .cerrarInfo > span').addClass('icon-arrow-down8');
// 	}
	
// 	if(anterior == id)
// 	{
// 		if($(content).css('display')=='none'){
// 			$(id+' > h3 > span:first-child').addClass('icon-minus');
// 			$(id+' > h3 > span:first-child').removeClass('icon-plus');
// 			$(anterior+' > h3 > .cerrarInfo > span').addClass('icon-arrow-up8');
// 			$(anterior+' > h3 > .cerrarInfo > span').removeClass('icon-arrow-down8');
// 		} else {
// 			$('.masInfo > h3 > span:first-child').removeClass('icon-minus');
// 			$('.masInfo > h3 > span:first-child').addClass('icon-plus');
// 			$(anterior+' > h3 > .cerrarInfo > span').removeClass('icon-arrow-up8');
// 			$(anterior+' > h3 > .cerrarInfo > span').addClass('icon-arrow-down8');
// 		}
// 	}
// 	else
// 	{
// 		$(id+' > h3 > span:first-child').removeClass('icon-plus');
// 		$(id+' > h3 > span:first-child').addClass('icon-minus');
// 		$(id+' > h3 > .cerrarInfo > span').removeClass('icon-arrow-down8');
// 		$(id+' > h3 > .cerrarInfo > span').addClass('icon-arrow-up8');
// 	}
	
// 	$(content).slideToggle(500);
// 	anterior=id;
// 	/*$('.acordeon .masInfo').animate({height:"30px"},5, function(){
// 			$('.masInfo > h3 > span:first-child').removeClass('icon-minus');
// 			$('.masInfo > h3 > span:first-child').addClass('icon-plus');
// 			$(id+' > h3 > span:first-child').removeClass('icon-plus');
// 			$(id+' > h3 > span:first-child').addClass('icon-minus');
// 			$(id).animate({height:heightContent},300);
// 	});	*/
// }

/* Pestañas Horizontales */

function pestHorizontales(li,j){
	var slides=$(".pestaniasH li").size();
	anchoPest=(100/slides);
	anchoPest='calc('+anchoPest+'% - 1px)';
	$('.pestaniasH li').css('width',anchoPest);
	for(i=1;i<=slides;i++){
		id='#contH'+i;
		activa=$('.pestaniasH li').hasClass('activa');
		$('.pestaniasH li').removeClass('activa');
		$('.contPestH > div').fadeOut(0);
		//$('.contPestH > div').removeClass('fundir');
	}
	id2='#contH'+j;
	$(li).addClass('activa');
	$(id2).fadeIn(0);
	//$(id2).addClass(fundir);
}

/* Pestañas Verticales */

function pestLaterales(li,j){
	var slides=$(".pestanias li").size();
	for(i=1;i<=slides;i++){
		id='#cont'+i;
		activa=$('.pestanias li').hasClass('activa');
		$('.pestanias li').removeClass('activa');
		$('.contPest > div').fadeOut(0);
	}
	id2='#cont'+j;
	$(id2).fadeIn(0);	
	$(li).addClass('activa');
}

function pestLaterales2(li,j){
	var slides=$(".pestLaterales2 .pestanias2 li").size();
	for(i=1;i<=slides;i++){
		id='#cont_'+i;
		activa2=$('.pestLaterales2 .pestanias2 li').hasClass('activa2');
		$('.pestLaterales2 .pestanias2 li').removeClass('activa2');
		$('.pestLaterales2 .contPest2 > div').fadeOut(0);
	}
	id2='#cont_'+j;
	$(id2).fadeIn(0);	
	$(li).addClass('activa2');
}

function pestLaterales3(li,j){
	var slides=$(".pestLaterales3 .pestanias3 li").size();
	for(i=1;i<=slides;i++){
		id='#cont3_'+i;
		activa2=$('.pestLaterales3 .pestanias3 li').hasClass('activa3');
		$('.pestLaterales3 .pestanias3 li').removeClass('activa3');
		$('.pestLaterales3 .contPest3 > div').fadeOut(0);
	}
	id2='#cont3_'+j;
	$(id2).fadeIn(0);	
	$(li).addClass('activa3');
}

// Contenido dinamico


function selectopcion(x){
	$(".opciones").removeClass("selected");
	$("#opcion"+x).addClass("selected");
	$(".textdinamico").fadeOut(0);
	$("#opcion"+x+"text").fadeIn();
	/*cambiopciones();*/
  }


/** Ejercicios **/


function generarPopupInt() {
	/*var alto = window.innerHeight;
	var ancho = window.innerWidth;
	var altoCabecera = $("#cabecera").height();
	var altoBotonera = $("#pie").height();
	alto = alto - altoBotonera - altoCabecera;
	var alto1=alto-100;
	var alto2=alto-150;*/
	var popup = document.getElementsByClassName("popup");
	/*for(var i = 0;i<popup.length;i++) {
		//$(popups[i]).css({"max-width":700,"width":"90%"})
		var anchoPop = $(popup[i]).width();		
		var altoPop = $(popup[i]).height();
		var id=popup[i].id;
		
		$(popup[i]).css({"max-height":(alto),"max-width":(ancho-150)});	
		$('#'+id+' .contenidoPopup').css({"max-height":(alto2),"max-width":(ancho-150),'padding':'10px'});	
		
		if(altoPop<($('#'+id+' .contenidoPopup').height())){
			altoPop=$('#'+id+' .contenidoPopup').height()+30;
		}
		
		var margenIz = -((anchoPop/2)+20)+"px";
		var margenTop = -(altoPop/2)+"px";
		margenIz = margenIz.toString();
		margenTop = margenTop.toString();
		//$(popups[i]).css({"top":posY+"%","left":posX+"%"})
		$(popup[i]).css({"margin-left":margenIz,"margin-top":margenTop,"top":"50%","left":"50%","height":"auto"});
	}*/
	$('.overlay').height($(window).height());
}


function resizeIframe(obj) {
	if(document.getElementById(obj)){
		document.getElementById(obj).style.height = document.getElementById(obj).contentWindow.document.body.scrollHeight + 'px';
	}
}	

function altura_iframe(){
		var numero_iframes = $('iframe').length;
		for (var i = 1; i <= numero_iframes; i++) {
			var altura = $("#grafico"+i).contents().find('#canvas').height();
			altura = altura + 50;
			$("#grafico"+i).height(altura+"px");
		}
	}

function ajustarResolucion() {

	clearTimeout(cuentaAtras);
	
	cuentaAtras=setTimeout(function()
	{
		//ajustarSlide();
		generarPopupInt();
		generarPopup();
		// resetAltura("resaltado1");
		
		// var heightPest2=$('.pestLaterales .contPest').height();
		// pestanas=$(".pestanias li").size();
		// if(heightPest2<(30*pestanas)){
		// 	heightPest2=30*pestanas;
		// }
		// $('.pestLaterales .pestanias li').height(heightPest2/pestanas);
		// $('.pestLaterales .pestanias li').css('line-height',heightPest2/pestanas+'px');
		// $('.pestLaterales > ul').css('height',(heightPest2+(pestanas+5))+'px');		
		
		clearTimeout(cuentaAtras);		
		
	},500);
	
	/*generarPopupInt();
	generarPopup();*/
	
	
	resizeIframe('iframe_ejercicio');
	altura_iframe();
	
	
	
}

/* Popups */

function generarPopup() {
	/*var alto = window.innerHeight;
	var ancho = window.innerWidth;
	var altoCabecera = $("#cabecera").height();
	var altoBotonera = $("#pie").height();
	alto = alto - altoBotonera - altoCabecera;
	var alto1=alto-100;
	var alto2=alto-180;*/
	var popups = document.getElementsByClassName("popups");
	/*for(var i = 0;i<popups.length;i++) {
		//var nombre = "popup"+(i+1);				
		//$(popups[i]).attr("id",nombre);
		var anchoPop = $(popups[i]).width();		
		var altoPop = $(popups[i]).height();
		var id=popups[i].id;
		$(popups[i]).css({"max-height":(alto1),"max-width":(ancho-150)});
		//$(popups[i]).css({"max-width":700,"width":"90%"})
		
		$('#'+id+' .contenidoPopup').css({"max-height":(alto2),"max-width":(ancho-150),'padding':'10px 0 0'});
		
//		alert(altoPop);
		if(altoPop<($('#'+id+' .contenidoPopup').height())){
			altoPop=$('#'+id+' .contenidoPopup').height()+30;
		}
/*		var posX = (ancho/2)-(anchoPop/2);
		posX = posX*100/ancho;
		var posY = (alto/2)-(altoPop/2);
		posY = posY*100/alto;*/
		
		/*var margenIz = -((anchoPop/2)+20)+"px";
		var margenTop = -(altoPop/2)+"px";
		margenIz = margenIz.toString();
		margenTop = margenTop.toString();
		//$(popups[i]).css({"top":posY+"%","left":posX+"%"})
		$(popups[i]).css({"margin-left":margenIz,"margin-top":margenTop,"height":"auto"});
	}*/
	$('.overlay').height($(window).height());
}
function mostrarPopup(popup) {
/*	var winH = $(window).height();
	var winW = $(window).width();
	$(popup).css('top', (winH/2-$(popup).height()/2));
	$(popup).css('left', (winW/2-$(popup).width()/2));*/
	$(popup).fadeIn();
	generarPopup();
	$('.overlay').fadeIn('slow');
	$('.overlay').height($(window).height());
	$('body').css('overflow','hidden');
}
function ocultarPopup(popup) {
	$(popup).fadeOut();
	$('.overlay').fadeOut('slow');
	$('body').css('overflow','auto');
	document.getElementsByTagName('video')[0].pause();
}
