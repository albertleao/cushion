//EXECUTE DYNALOADER ON DOCUMENT LOAD
$(document).ready(function(){
	if($("#cushion-default-output").length == 0) {
		$("body").append("<div id='cushion-default-output'></div>")
		$("#cushion-default-output").css({'position' : 'absolute', 'top' : '-9999px', 'left' : '-9999px'})
	}
	dynaLoader();
})

//Handle Click Event
$(document).on("click", "a", function(a){	
	var object = $(this)
	if($(object).data("ajax") == true) {
		a.preventDefault();
		actions(object)
		if(object.attr('href') != "#" && object.data('reload') == undefined) {
			ajaxify(object)
		} else if(object.data("ajax") == true && object.attr('href') == "#"){
			reload(object)
		}
	} else {
		actions(object)
	}
})

function ajaxify(object) {
	if(object.data('history') !== false){
		//create_history(object)
	}
	ajaxGet(object)
}

function handleHistory() {
	if(history.pushState) {
		if(history.state == null) {
			var path = $(location).attr('pathname')
		} else {
			var path = history.state
		}
		$.ajax({
			url: config.baseurl + path,
			success:function(result) {
				$(config.content).html(result);
			},
			complete:function() {
				dynaLoader()
			}
		} 
	}
}
//POPSTATE on history change
window.setTimeout(function() {
	$(window).bind('popstate', function(e) {
		handleHistory(e);
	})
}, 5000);
//HASHCHANGE
$(window).on("hashchange", function() {
    if (currentlySettingHash) {
        currentlySettingHash = false;
        return;
    }

    currentlySettingHash = false;
    params = new Object()
    if(window.location.hash == "") {
    	params.path = '/'
    }
    $.ajax({
    	url: config.baseurl + "/" + params.path,
    	success:function(result){
    		$(config.content).html(result)
    	},
    	complete:function(){
    		dynaLoader()
    	}
    })
});
function createHistory(object) {
	var new_url = object.attr('href') == 'undefined' ? object.data('href') : object.attr('href')
	if(config.platform == 'browser') {
		if(history.pushState) {
			window.history.pushState(new_url, "", new_url);
		}
		else {
			window.location.hash = new_url;
		}
	}
}

function ajaxGet(object){
	actions(object)
	$.ajax({
		url: config.baseUrl + object.attr('href'),
		beforeSend:function(xhr, plainObject){
			cushionAjaxBeforeSend(xhr, plainObject, object);
			cushionAjaxGetBeforeSend(xhr, plainObject, object);
		},
		success:function(data, textStatus, xhr) {
			window.scrollTo(0,0);
			handleOutput(object, data)
			cushionAjaxSuccess(data, textStatus, xhr, object)
			cushionAjaxGetSuccess(data, textStatus, xhr, object)
		},
		complete:function(xhr, textStatus){
			dynaLoader()
			cushionAjaxComplete(xhr, textStatus, object)
			cushionAjaxGetComplete(xhr, textStatus, object)
		},
		error:function(jqXHR, textStatus, errorThrown){
			cushionAjaxError(jqXHR, textStatus, errorThrown, object);
			cushionAjaxGetError(jqXHR, textStatus, errorThrown, object);
		}
	})
}

//FORM SUBMISSION
$(document).on("submit", "form", function(a){
	if($(this).data("ajax") == true) {
		a.preventDefault();
		var posting = false;

		object = $(this)

		var fd = new FormData();
		if(object.find('input[type="file"]')[0] != undefined) {
			var file_data = $(this).find('input[type="file"]')[0].files; // for multiple files
			for(var i = 0;i<file_data.length;i++){
				fd.append("userfile", file_data[i]);
			}
		}

		var other_data = object.serializeArray();

		$.each(other_data,function(key,input){
			fd.append(input.name,input.value);
		});

		var $form = $(this);
		$inputs = $form.find("input, file, select, hidden, checkbox, button, textarea, submit");
		
		serializedData = $inputs.serialize();

		$.ajax({
			type: "POST",
			url: config.baseUrl + object.attr("action"),
			data: serializedData,
			beforeSend:function(xhr, plainObject){
				cushionAjaxBeforeSend(xhr, plainObject, object);
				cushionAjaxPostBeforeSend(xhr, plainObject, object);
			},
			success:function(data, textStatus, xhr) {
				handleOutput(object,data)
				cushionAjaxSuccess(data, textStatus, xhr)
				cushionAjaxPostSuccess(data, textStatus, xhr)
			},
			complete:function(xhr, textStatus){
				cushionAjaxComplete(xhr, textStatus, object)
				cushionAjaxPostComplete(xhr, textStatus, object)
			},
			error:function(jqXhr, textStatus, errorThrown){
				cushionAjaxError(textStatus, jqXhr, errorThrown, object);
				cushionAjaxPostError(textStatus, jqXhr, errorThrown, object);
			}
		})
	}
})

//DYNAMICALLY LOAD CONTENT VIA DATA-LOAD ATTRIBUTES
function dynaLoader(){
	$('[data-load]').each(function(){
		var object = $(this);
		var target = object.get(0);
		var hidden = object.data('hidden')
		if(object.data('loaded') == undefined || object.attr('data-loaded') == 'false') {
			$.ajax({
				url: object.data('load'),
				beforeSend:function(xhr, plainObject){
					cushionAjaxBeforeSend(xhr, plainObject, object);
					cushionAjaxGetBeforeSend(xhr, plainObject, object);
					object.attr('data-loaded', 'true');
				},
				success:function(data, textStatus, xhr){
					object.html(data)
					cushionAjaxSuccess(data, textStatus, xhr, object)
					cushionAjaxGetSuccess(data, textStatus, xhr, object)
				},
				complete:function(xhr, textStatus) {
					cushionAjaxComplete(xhr, textStatus, object);
					cushionAjaxGetComplete(xhr, textStatus, object);
					dynaLoader();
				},
				error:function(textStatus, xhr, errorThrown){
					cushionAjaxError(textStatus, xhr, errorThrown, object);
					cushionAjaxGetError(textStatus, xhr, errorThrown, object);
				}
			})
		}
    })
}

function reload(object) {
	setTimeout(function(){
		$(object.data("reload")).attr('data-loaded', 'false');
		dynaLoader();
	}, 500)
}