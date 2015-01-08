
function equalsString(a, b) {
	if (!a) {
		return false;
	}
	
	if (!b) {
		return false;
	}
	
	return jQuery.trim(a).localeCompare(jQuery.trim(b)) == 0;
}

function stringStartsWith(target, sub) {
	return target.indexOf(sub) == 0;
}

function fillXMLTemplate(template, properties) {
	var result = template;
	
	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			result = result.replace("${"+key+"}", properties[key]);	
		}
	}
	
	return result;
}

function isImageMimetype(mimetype) {
	
	return ($.inArray(mimetype, imageMimetypes) > -1);
}

function stringify(format){

    return '{"mimeType" : "' + (format.mimeType ? format.mimeType : "") + '", "schema" : "' + (format.schema ? format.schema : "") + '", "encoding" : "' + (format.encoding ? format.encoding : "") + '"}';
    
}

function escapeCharactersForSelect(id){

    var result = id.replace(/\./g,"\\.");

    return result;
}