/*******************************************************************************
** 
** Filename: SCOFunctions.js
**
** File Description: This file contains several JavaScript functions that are 
**                   used by the Sample SCOs contained in the Sample Course.
**                   These functions encapsulate actions that are taken when the
**                   user navigates between SCOs, or exits the Lesson.
**
** Author: ADL Technical Team
**
** Contract Number:
** Company Name: CTC
**
** Design Issues:
**
** Implementation Issues:
** Known Problems:
** Side Effects:
**
** References: ADL SCORM
**
********************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee
** does not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE
** POSSIBILITY OF SUCH DAMAGES.
**
*******************************************************************************/
var startDate;
var exitPageStatus;
var startPage;
var lmsPuntuacion;
var strData = "#";
var bolPrimeraVez = true;

function loadPage()
{
   var sSuspend = "1";
	
   var result = doInitialize();

   var status = doGetValue( "cmi.completion_status" );
   
   if (status == "not attempted")
   {
	  // the student is now attempting the lesson
	  doSetValue( "cmi.completion_status", "incomplete" );
   }
   exitPageStatus = false;
   startTimer();

	//Comentado por Diego
   //initPage();
   //initTest();
   //Fin Comentario
}


function startTimer()
{
   startDate = new Date().getTime();
}

function computeTime()
{
   if ( startDate != 0 )
   {
      var currentDate = new Date().getTime();
      var elapsedSeconds = ( (currentDate - startDate) / 1000 );
      var formattedTime = convertTotalSeconds( elapsedSeconds );
   }
   else
   {
      formattedTime = "00:00:00.0";
   }

   doSetValue( "cmi.session_time", formattedTime );
}

function doBack()
{
   //doSetValue( "cmi.core.exit", "suspend" );

   computeTime();
   exitPageStatus = true;
   
   var result;

   result = doCommit();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   
   
   result = doTerminate();

}

function doContinue( status )
{
   // Reinitialize Exit to blank
   //doSetValue( "cmi.core.exit", "" );

   var mode = doGetValue( "cmi.mode" );

   if ( mode != "review"  &&  mode != "browse" )
   { 
      doSetValue( "cmi.completion_status", status );
   }
 
   computeTime();
   exitPageStatus = true;
   
   var result;
   result = doCommit();
	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   

   result = doTerminate();

}

function doQuit()
{
   
   doSetValue( "cmi.exit", "suspend" );

   computeTime();
   exitPageStatus = true;
   
   var result;

   result = doCommit();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   

   result = doTerminate();
}

/*******************************************************************************
** The purpose of this function is to handle cases where the current SCO may be 
** unloaded via some user action other than using the navigation controls 
** embedded in the content.   This function will be called every time an SCO
** is unloaded.  If the user has caused the page to be unloaded through the
** preferred SCO control mechanisms, the value of the "exitPageStatus" var
** will be true so we'll just allow the page to be unloaded.   If the value
** of "exitPageStatus" is false, we know the user caused to the page to be
** unloaded through use of some other mechanism... most likely the back
** button on the browser.  We'll handle this situation the same way we 
** would handle a "quit" - as in the user pressing the SCO's quit button.
*******************************************************************************/
function unloadPage()
{

	if (exitPageStatus != true)
	{
		doQuit();
	}

	// NOTE:  don't return anything that resembles a javascript
	//		  string from this function or IE will take the
	//		  liberty of displaying a confirm message box.
	
}

/*******************************************************************************
** this function will convert seconds into hours, minutes, and seconds in
** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
** Min of 2 digits
*******************************************************************************/
function convertTotalSeconds(ts)
{
   var sec = (ts % 60);

   ts -= sec;
   var tmp = (ts % 3600);  //# of seconds in the total # of minutes
   ts -= tmp;              //# of seconds in the total # of hours

   // convert seconds to conform to CMITimespan type (e.g. SS.00)
   sec = Math.round(sec*100)/100;
   
   var strSec = new String(sec);
   var strWholeSec = strSec;
   var strFractionSec = "";

   if (strSec.indexOf(".") != -1)
   {
      strWholeSec =  strSec.substring(0, strSec.indexOf("."));
      strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
   }
   
   if (strWholeSec.length < 2)
   {
      strWholeSec = "0" + strWholeSec;
   }
   strSec = strWholeSec;
   
   if (strFractionSec.length)
   {
     //No le ponemos dcimas de segundo
	 //strSec = strSec+ "." + strFractionSec;
   }


   if ((ts % 3600) != 0 )
      var hour = 0;
   else var hour = (ts / 3600);
   if ( (tmp % 60) != 0 )
      var min = 0;
   else var min = (tmp / 60);

   if ((new String(hour)).length < 2)
      hour = "0"+hour;
   if ((new String(min)).length < 2)
      min = "0"+min;

   var rtnVal = hour+":"+min+":"+strSec;

   return rtnVal;
}


/*******************************************************************************
** SCO
*******************************************************************************/
function aplicaNotaTest(nota,apruebacon)
{
  doSetValue("cmi.score.raw",nota);
  //En este curso no se guarda como passes o failed (esto se guardan como objetivos), sino como completed o incompleted 
 if (nota >= apruebacon)
	{
                      //doSetValue("cmi.completion_status","passed");
					  completado();
	}
	else   {
                                 //doSetValue("cmi.completion_status","failed");
								 incompleto()
	       }
						
  
  var result;
   result = doCommit();
}

function leeNotaTest()
{
  var nota = doGetValue( "cmi.score.raw" );
  return nota;
  
  var result;
  result = doCommit();
}

function completado()
{
  doSetValue("cmi.completion_status","completed");
   var result;
   result = doCommit();
}

function passed()
{
  doSetValue("cmi.success_status","passed");
   var result;
   result = doCommit();
}


function failed()
{
  doSetValue("cmi.success_status","failed");
   var result;
   result = doCommit();
}


function incompleto()
{
  doSetValue("cmi.completion_status","incomplete");
   var result;
   result = doCommit();
}


function initPage() {
   startPage = doGetValue("cmi.location");
   window.parent.dato_suspend=doGetValue("cmi.suspend_data");
	
   /*if ((startPage.indexOf("Entrada")== -1) && (startPage!="") && (startPage.indexOf("test_")== -1) && (startPage.indexOf("blank")== -1)) {
   	if(confirm("Desea volver al curso en el lugar en el que lo dej la ltima vez que lo visit?")) { 
		window.parent.barra.document.images["botonAtras"].src = "../recursos/images/flecha_iz.jpg";
		window.content.location.href="html/" + doGetValue("cmi.location")
		//return true;
	}
    else return false;
   }*/
   
   	//window.status="intentos before ";
/*	var intentos = leeNumeroIntentos();
	//window.status="intentos: " + intentos;
	if (intentos=="2") {
		alert("Ya ha realizado los dos intentos.");
		window.parent.barra.document.images["botonAdelante"].src = "../recursos/images/flecha_der_off.jpg";
		window.parent.barra.document.FormBarra.pagPos.value = 'javascript:void(null)';
		window.parent.barra.document.FormBarra.FinPagina.value = "false"
	}
*/
}

function initTest() {
		var nIntentos = 0;
		if ((startPage.indexOf("md")== -1) && (startPage.indexOf("modulo")== -1)) {
			nIntentos = doGetValue( "cmi.suspend_data");
			if (nIntentos == "1") {
				window.parent.barra.document.images["botonAdelante"].src = "../recursos/images/flecha_derecha.gif";
				window.parent.barra.document.FormBarra.FinPagina.value = "true";
				alert("Este test consta como ya realizado. Puedes repetirlo tantas veces como quieras para comprobar tus progresos, pero la puntuacin final ser la que obtuviste en EL primer intento");
			}
			else {
				window.parent.barra.document.images["botonAdelante"].src = "../recursos/images/flecha_derecha.gif";
				window.parent.barra.document.FormBarra.FinPagina.value = "true";				
			}
		}

}

function completadoFaltaTest()
{
  var estado = doGetValue( "cmi.completion_status" );
  if (estado != "passed" && estado != "failed")
	{
        doSetValue("cmi.completion_status","completed");
	}

   var result;
   result = doCommit();
}


function grabaSuspenData(strData) {
	doSetValue("cmi.suspend_data",strData);
	doCommit();
}

function grabaNumeroIntentos(numero)
{ 
  doSetValue( "cmi.suspend_data",numero);
  var result;
  result = doCommit();
}


function leeNumeroIntentos() {
  var nIntentos=doGetValue( "cmi.suspend_data");
  return nIntentos;
	
  var result;
  result = doCommit();	
}

function grabaUltimaPag(pagina)
{
  doSetValue( "cmi.location",pagina);
   var result;
   result = doCommit();
}

function salir() {
		window.top.close(); 
}


