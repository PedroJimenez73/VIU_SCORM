var btnSig = document.getElementById("btnSig");
var pie = document.getElementById("pie");

var start = setTimeout(function(){
	btnAtras.style.display = "initial";
},500);

if (TemaActual === 0) {
	btnAtras.classList.add("ocultar");
}

//Actualización desde Menu

function actTema(n){
	TemaActual = n;
	if (TemaActual === 0) {
		btnAtras.classList.add("ocultar");
		btnSig.classList.remove("ocultar");
	} else if (TemaActual === 14){
		btnSig.classList.add("ocultar");
		btnAtras.classList.remove("ocultar");
	} else {
		btnSig.classList.remove("ocultar");
		btnAtras.classList.remove("ocultar");
	}
}

/*
 Pagina JS de avance
*/

function temaSiguiente() {
	var pantalla = parseInt(TemaActual);	
	if (pantalla+1 < tIndice.length) 
	{	
			
		TemaActual++;
		if(TemaActual>avance_j)
		{
			avance_j = TemaActual;
		}
		
		pasarpagina();
		guardarPosicion();
		calcularPuntacion();			
	} // end if	
//	cambiarAudio();
if (TemaActual === 0) {
	btnAtras.classList.add("ocultar");
	btnSig.classList.remove("ocultar");
} else if (TemaActual === 14){
	btnSig.classList.add("ocultar");
	btnAtras.classList.remove("ocultar");
} else {
	btnSig.classList.remove("ocultar");
	btnAtras.classList.remove("ocultar");
}
console.log(TemaActual);
	
}//fin funcion

function temaAnterior()
{	
	//activarSiguiente();	
	if (TemaActual > 0) {	
        --TemaActual;
         paginaAtras();
		 guardarPosicion();
		 calcularPuntacion()
		 avance = TemaActual;
		 //pasarcomando("cmi.core.lesson_location",avance);
		
	} // end if	
	if (TemaActual === 0) {
		btnAtras.classList.add("ocultar");
		btnSig.classList.remove("ocultar");
	} else if (TemaActual === 14){
		btnSig.classList.add("ocultar");
		btnAtras.classList.remove("ocultar");
	} else {
		btnSig.classList.remove("ocultar");
		btnAtras.classList.remove("ocultar");
	}
} //fin funcion

function Inicio(){
	if(TemaActual!=0) {
		TemaActual=0;
		cargarPagina();
	}
}











