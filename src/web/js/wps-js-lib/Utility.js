
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