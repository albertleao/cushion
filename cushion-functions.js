function actions(object) {
	//Hide Object
	if(object.data('hide') != undefined){
		if(object.data('hide') == 'this') {
			$(object).hide()
		} else {
			$(object.data('hide')).hide()
		}
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
		$(object.data('toggleClassTarget')).toggleClass(object.data('toggleClass'))
	}

	//Toggle Object
	if(object.data('toggle') != undefined) {
		$(object.data('toggle')).toggle()
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

	customActions(object);
}

function handleOutput(object, data) {
	//Chosen Target
	if(object.data('target') && object.data('target') != 'this'){
		if(object.data('show') != false){
			$(object.data('target')).hide().html(data).show();
		}
	}
	//Replace Current
	else if(object.data('target') == 'this') {
		object.replaceWith(data)
	} 
	else if(object.data('load') != undefined) {
		object.html(data)
	}
	else {
		$("#cushion-default-output").html(data)
	}
}

function handleAnimation(object) {
	if(object.data('target') && object.data('target') != 'this'){
			$(object.data('target')).html(config.loadingAnimation)
	}
	else if(object.data('target') == 'this') {
		object.replaceWith(config.loadingAnimation)
	}
}