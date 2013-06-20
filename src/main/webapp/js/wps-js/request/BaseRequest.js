
var BaseRequest = Class.extend({
	init : function(settings) {
		this.settings = settings;
	},

	getSettings : function() {
		return this.settings;
	},

	execute : function(callback) {
		/*
		 * define a callback which gets called after finishing the request
		 */
		this.callback = callback;
		
		this.preRequestExecution();

		this.executeHTTPRequest(this.prepareHTTPRequest());

		this.postRequestExecution();
	},

	preRequestExecution : function() {
		this.changeElementContent('<div class="wps-waiting"></div>');
	},

	postRequestExecution : function() {

	},

	processResponse : function(xml) {
		return '<div class="wps-success"><div class="wps-generic-success"></div></div>';
	},

	changeElementContent : function(htmlContent) {
		this.settings.domElement.html(htmlContent);
	},
	
	prepareHTTPRequest : function() {
		return null;
	},

	executeHTTPRequest : function(requestSettings) {
		var self = this;
		
		var combinedRequestSettings = $.extend({
			success : function(data) {
				if (self.callback) {
					self.callback(data, self.settings.domElement);
				} else {
					htmlContent = self.processResponse(data);
					self.changeElementContent(htmlContent);	
				}
			},
			error: function() {
				self.changeElementContent('<div class="wps-error"><div class="wps-generic-error"></div>'+
						'<div>An error occured while connecting to '+
						self.settings.url +'</div></div>');
			}
		}, requestSettings);
		
		$.ajax(this.settings.url, combinedRequestSettings);
	}
});
