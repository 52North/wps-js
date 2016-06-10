
var BaseResponse = Class.extend({
	
	init : function(xmlResponse, originalRequest) {
		this.xmlResponse = xmlResponse;
		this.originalRequest = originalRequest;
	},
	
	createMarkup : function() {
		return '<div class="wps-success"><div class="wps-generic-success"></div></div>';
	}

});
