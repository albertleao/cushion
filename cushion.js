/*********************************************************************************************************/
/***************************************** CUSHION.JS V3.0.0 ***********************************************/
/*********************************************************************************************************/
if(typeof config == "undefined") {
	var config = {};
}

var cushionInitialize = function(setupObject) {
    jQuery.each(setupObject, function(index, value) {
        config[index] = value
    });
};


var $models = {};

config.currentlySettingHash = false


//EXECUTE DYNALOADER ON DOCUMENT LOAD
$(document).ready(function(){
	if($("#cushion-default-output").length == 0) {
		$("body").append("<div id='cushion-default-output'></div>")
		$("#cushion-default-output").css({'position' : 'absolute', 'top' : '-9999px', 'left' : '-9999px'})
	}
	dynaLoader();
	loadModels()
})

//Handle Click Event
$(document).on("click", "a, button", function(a){	
	var object = $(this);
	if($(object).data("ajax") == true) {
		a.preventDefault();
		actions(object);
		if(object.attr('href') != "#" && object.data('reload') == undefined) {
			ajaxify(object)
		} else if(object.data("ajax") == true && object.attr('href') == "#"){
			reload(object)
		}
	}
	actions(object);
	loadModels();
});

//Handle change event
$(document).on("change", 'select', function(a) {
	var object = $(this);
	if(object.data("ajax") == true) {
		a.preventDefault();
		actions(object);
		ajaxify(object)
	}
})

$(document).on("keydown change", "input[cs-model]",function(){
	loadModels()
})

function loadModels() {
	$("input[cs-model]").each(function(i, ele) {
		var modelName = $(ele).attr('cs-model');
		var modelValue = $(ele).val();
		$models[modelName] = modelValue;
	})
}

function ajaxify(object) {
	if(object.data('history') !== false){
		createHistory(object)
	}
	if(object.prop('nodeName') == 'SELECT') {
		url = object.val();
	} else {
		url = object.attr('href')
	}
	ajaxGet(url, object)
}

function handleHistory() {
	if(history.pushState && config.history == 'pushState') {
		if(history.state == null) {
			var path = config.baseUrl
		} else {
			var path = history.state
		}
		object = {}
		$.ajax({
			url: config.baseUrl + path,
			success:function(data, textStatus, xhr) {
				$(config.content).html(data);
			},
			complete:function() {
				dynaLoader()
			}
		}) 
	}
}
//POPSTATE on history change
window.setTimeout(function() {
	$(window).bind('popstate', function(e) {
		handleHistory(e);
	})
}, 1000);

//HASHCHANGE
$(window).on("hashchange", function() {
    if (config.history == 'hash' && config.currentlySettingHash == false) {
    	params = new Object()
	    if(window.location.hash == "") {
	    	params.path = '/'
	    } else {
	    	params.path = window.location.hash.substr(1);
	    }
	    $.ajax({
	    	url: config.baseUrl + "/" + params.path,
	    	beforeSend:function() {
				$(config.content).html(config.loadingAnimation)
	    	},
	    	success:function(result){
	    		try {
					data = JSON.parse(result);
					if(data.request == 'redirect') {
						json_redirect = true;
						$.ajax({
							url: config.baseUrl+data.url,
							success:function(result) {
								$(config.content).html(result)
							},
							complete:function(){
								dynaLoader()
							}
						})
					}
				} catch(e) {}
				if(typeof json_redirect === 'undefined') {
					$(config.content).html(result)
				}
	    	},
	    	complete:function(){
	    		dynaLoader();
	    		config.currentlySettingHash = false
	    	}
	    })
    } else if(config.currentlySettingHash == true) {
    	config.currentlySettingHash = false
    }
});

function createHistory(object) {
    var new_url;

	if(object.data('history') != undefined) {
		new_url = object.data('history');
	} else {
		new_url = object.attr('href') == 'undefined' ? object.data('href') : object.attr('href')
	}
	if(history.pushState && config.history == 'pushState') {
		window.history.pushState(new_url, "", new_url);
	} else if(config.history == 'hash') {
		config.currentlySettingHash = true
		window.location.hash = new_url;	
	}
}

function ajaxGet(url, object){
	$.ajax({
		url: config.baseUrl + url,
		beforeSend:function(xhr, plainObject){
			preActions(object)
			cushionAjaxBeforeSend(xhr, plainObject, object);
			cushionAjaxGetBeforeSend(xhr, plainObject, object);
		},
		success:function(data, textStatus, xhr) {
			cushionAjaxSuccess(data, textStatus, xhr, object)
			cushionAjaxGetSuccess(data, textStatus, xhr, object)
		},
		complete:function(xhr, textStatus){
			dynaLoader()
			cushionAjaxComplete(xhr, textStatus, object)
			cushionAjaxGetComplete(xhr, textStatus, object)
			manageReloaders(object);
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
		object = $(this)
		object.find('button').attr('disabled', 'disabled')
		var fd = new FormData();
		if(object.find('input[type="file"]')[0] != undefined) {
			var file_data = $(this).find('input[type="file"]')[0].files; // for multiple files
			for(var i = 0;i<file_data.length;i++){
				fd.append("userfile", file_data[i]);
			}
		}

		var other_data = object.serializeArray();

		options = {
			type: "POST",
			url: object.attr("action"),
			beforeSend:function(xhr, plainObject){
				cushionAjaxBeforeSend(xhr, plainObject, object);
				cushionAjaxPostBeforeSend(xhr, plainObject, object);
			},
			success:function(data, textStatus, xhr) {
				cushionAjaxSuccess(data, textStatus, xhr, object)
				cushionAjaxPostSuccess(data, textStatus, xhr, object)
			},
			complete:function(xhr, textStatus){
				cushionAjaxComplete(xhr, textStatus, object)
				cushionAjaxPostComplete(xhr, textStatus, object)
				object.find('button').attr('disabled', false)
				actions(object)
				dynaLoader()
				if(object.data('reset') == false) {
					object.find('input:password').val('');
				} else {
					object[0].reset();
				}
			},
			error:function(jqXhr, textStatus, errorThrown){
				cushionAjaxError(textStatus, jqXhr, errorThrown, object);
				cushionAjaxPostError(textStatus, jqXhr, errorThrown, object);
			}
		}
        	$(this).ajaxSubmit(options)
	}
})

//DYNAMICALLY LOAD CONTENT VIA DATA-LOAD ATTRIBUTES
function dynaLoader(){
	window.setTimeout(function() {
		$('[data-load]').each(function(){
			var object = $(this);
			var target = object.get(0);
			if(object.data('loaded') == undefined || object.attr('data-loaded') == 'false') {
				$.ajax({
					url: config.baseUrl + object.data('load'),
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
						manageReloaders(object)
					},
					error:function(textStatus, xhr, errorThrown){
						cushionAjaxError(textStatus, xhr, errorThrown, object);
						cushionAjaxGetError(textStatus, xhr, errorThrown, object);
					}
				})
			}
		})
	}, 1);
}

function manageReloaders(object) {
	$('[data-fetch-new]').each(function() {
		if(config.reloaders[$(this).attr('data-fetch-new')] == undefined) {
			config.reloaders[$(this).attr('data-fetch-new')] = {interval: $(this).attr('data-fetch-interval'), placement: $(this).attr('data-fetch-placement')}
		}
	})
}

window.setInterval(function() {
	iterateReloaders()
}, 1000)

function iterateReloaders() {
	for (var key in config.reloaders) {
		if(key != undefined && $("[data-fetch-new='"+key+"']").length == 1) {
			if(config.reloaders[key]['counter'] == undefined) {
				config.reloaders[key]['counter'] = config.reloaders[key]['interval']
				config.reloaders[key]['status'] = 'pending'
			}
			if(config.reloaders[key]['counter'] > 0 && config.reloaders[key]['status'] == 'pending') {
				config.reloaders[key]['counter']--
			}
			else if(config.reloaders[key]['counter'] == 0 && config.reloaders[key]['status'] == 'pending') {
				config.reloaders[key]['status'] = 'executing'
				executeReloader($("[data-fetch-new='"+key+"']"), config.reloaders[key])
			}
		} else {
			delete config.reloaders[key]; 
		}
	}
}

function executeReloader(object, iterator) {
	if(object.attr('data-fetch-placement') == 'append') {
		next_id = object.children().last().attr('data-loadnext-id');
	} 
	if(object.attr('data-fetch-placement') == 'prepend') {
		next_id = object.children().first().attr('data-loadnext-id');
	}
	if(object.attr('data-fetch-new').indexOf('?') === -1) {
		next_url = '?newest='+next_id;
	} else {
		next_url = '&newest='+next_id;
	}
	$.ajax({
		url: config.baseUrl + object.attr('data-fetch-new') + next_url,
		beforeSend:function(xhr, plainObject){
			preActions(object)
			cushionAjaxBeforeSend(xhr, plainObject, object);
			cushionAjaxGetBeforeSend(xhr, plainObject, object);
		},
		success:function(data, textStatus, xhr) {
			if(data.trim() != '') {
				if(object.attr('data-fetch-placement') == 'append') {
					object.append(data)
				}
				if(object.attr('data-fetch-placement') == 'prepend') {
					var $data = $(data)
					$($data, '.social-post').css('display', 'none')
					if($(".load-more-btn").length == 0) {
						object.prepend(""+
						"<div class='form-group'"+
						"<a class='form-group btn btn-default btn-sm col-xs-12 col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-3 load-more-btn' data-show='.social-post' data-remove='this'>"+
							"Load More Posts"+
						"</a><div class='clearfix'></div>");
					}
					object.prepend($data)
				}
			}
		},
		complete:function(xhr, textStatus){
			cushionAjaxComplete(xhr, textStatus, object)
			cushionAjaxGetComplete(xhr, textStatus, object)
			iterator.status = 'pending'
			iterator.counter = object.attr('data-fetch-interval')
			manageReloaders(object);
		},
		error:function(jqXHR, textStatus, errorThrown){
			cushionAjaxError(jqXHR, textStatus, errorThrown, object);
			cushionAjaxGetError(jqXHR, textStatus, errorThrown, object);
		}
	})
}

function reload(object) {
	setTimeout(function(){
		$(object.data("reload")).attr('data-loaded', 'false');
		dynaLoader();
	}, 500)
}


/*********************************************************************************************************/
/********************************************** ACTIONS **************************************************/
/*********************************************************************************************************/



function actions(object) {
	//Hide Object
	if(object.data('hide') != undefined){
		if(object.data('hide') == 'this') {
			$(object).hide()
		} else {
			$(object.data('hide')).hide()
		}
	}

	if(object.data('reload-target') != undefined) {
		$(object.data('reload-target')).attr('data-loaded', 'false');
		window.setTimeout(function() {
			dynaLoader()
		}, 100)
	}

	//Show Object
	if(object.data('show') != undefined) {
		if(object.data('show') == 'this') {
			$(object).show()
		} else {
			$(object.data('show')).show()
		}
	}

	//Toggle Classes
	if(object.data('toggle-class') != undefined && object.data('toggle-class-target') != undefined) {
		$(object.data('toggle-class-target')).toggleClass(object.data('toggle-class'))
	}

	//Toggle Object
	if(object.data('toggle') != undefined) {
		$(object.data('toggle')).toggle()
	}

	if(object.data('slidetoggle') != undefined) {
		$(object.data('slidetoggle')).slideToggle();
	}
	
	//Toggle Classes
	if(object.data('empty') != undefined){
		if(object.data('empty') == 'this') {
			$(object).empty()
		} else {
			$(object.data('empty')).empty()
		}
	}
	//Navigate
	if(object.data('navigate') == 'back') {
		history.back()
	}
	
	//Remove
	if(object.data('remove') != undefined) {
		if(object.data('remove') == 'this') {
			$(object).remove();
		} else { 
			$(object.data('remove')).remove();
		}
	}

	customActions(object);
}

function preActions(object) {
	if(object.data('loading-text') != undefined) {
		object.html(object.data('loading-text'));
	}
}


function handleOutput(object, data) {
	//Chosen Target
	if(object.data('target') != undefined && object.data('target') != 'this' && object.data('target') != 'parent'){
		if(object.data('show') != false){
			$(object.data('target')).hide().html(data).show();
		}
	}
	if(object.data('append') != undefined) {
		$(object.data('append')).append(data)
	}
	if(object.data('replace') != undefined) {
		$(object.data('replace')).replaceWith(data);
	}
	//Replace Current
	else if(object.data('target') == 'this') {
		object.replaceWith(data)
	} 
	else if(object.data('target') == 'parent') {
		object.parent().html(data)
	}
	else if(object.data('load') != undefined) {
		object.html(data)
	} else if(object.data('target') == undefined) {
		$("#cushion-default-output").html(data)
	}
}

function handleAnimation(object) {
	if(object.data('target') && object.data('target') != 'this' && object.data('loading-gif') == undefined && object.data('loading-gif') != false){
		$(object.data('target')).html(config.loadingAnimation)
	}
	if(object.data('load') != undefined && object.data('loading-gif') == undefined) {
		$(object).html(config.loadingAnimation)
	}
}
