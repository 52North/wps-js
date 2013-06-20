
var BaseResponse = Class.extend({
	
	init : function(xmlResponse, outputElement) {
		this.xmlResponse = xmlResponse;
		this.outputElement = outputElement;
	},
	
	createMarkup : function() {
		return '<div class="wps-success"><div class="wps-generic-success"></div></div>';
	}

});
