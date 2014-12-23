/*********************************************************************************************************/
/************************************ GLOBAL REQUEST FUNCTIONS *******************************************/
/*********************************************************************************************************/

//Specifies a function to run before th2e AJAX request is sent
function cushionAjaxBeforeSend(xhr, plainObject, object){

}

//Specifies a function to run when an AJAX request completes successfully
function cushionAjaxSuccess(data, textStatus, xhr, object){
	handleOutput(object, data)
}

//Specifies a function to run when the AJAX request completes with an error
function cushionAjaxError(textStatus, xhr, errorThrown, object){

}

//Specifies a function to run when the AJAX request completes
function cushionAjaxComplete(xhr, textStatus, object){

}


/*********************************************************************************************************/
/************************************* GET REQUEST FUNCTIONS *********************************************/
/*********************************************************************************************************/

//Specifies a function to run before the AJAX request is sent
function cushionAjaxGetBeforeSend(xhr, plainObject, object){
	handleAnimation(object)
}

//Specifies a function to run when an AJAX request completes successfully
function cushionAjaxGetSuccess(data, textStatus, xhr, object){

}

//Specifies a function to run when the AJAX request completes with an error
function cushionAjaxGetError(textStatus, xhr, errorThrown, object){

}

//Specifies a function to run when the AJAX request completes
function cushionAjaxGetComplete(xhr, textStatus, object){

}


/*********************************************************************************************************/
/************************************* POST REQUEST FUNCTIONS ********************************************/
/*********************************************************************************************************/

//Specifies a function to run before the AJAX request is sent
function cushionAjaxPostBeforeSend(xhr, plainObject, object){

}

//Specifies a function to run when an AJAX request completes successfully
function cushionAjaxPostSuccess(data, textStatus, xhr, object){

}

//Specifies a function to run when the AJAX request completes with an error
function cushionAjaxPostError(textStatus, xhr, errorThrown, object){

}

//Specifies a function to run when the AJAX request completes
function cushionAjaxPostComplete(xhr, textStatus, object){

}

/*********************************************************************************************************/
/************************************** CREATE CUSTOM ACTIONS ********************************************/
/*********************************************************************************************************/
function customActions(object) {
	
}