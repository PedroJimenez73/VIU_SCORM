

function salirInterface(){
	document.getElementById('salir').style.display='block';
}


function salir(){
	doLMSFinish();
}

function pasarcomando(param,valor,param1,valor1){
	doLMSSetValue(param,valor);
	doLMSCommit();
	if (param1=="completo"){
		completado();	
	}
	else if (param1!="" && valor1!=""){
		doLMSSetValue(param1,valor1);
		doLMSCommit();
	}
}

function completar(){
	completado();
}

function guardarnota(intento,nota,minimo){
	pasarcomando('cmi.suspend_data',intento,'','');
	aplicaNotaTest(nota,minimo);
}

