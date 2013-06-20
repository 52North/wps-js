
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

		this.executeHTTPCall();

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

	executeHTTPCall : function() {
		var self = this;
		
		$.get(this.settings.url, function(data){
			if (self.callback) {
				self.callback(data, this.settings.domElement);
			} else {
				htmlContent = self.processResponse(data);
				self.changeElementContent(htmlContent);	
			}
		}).fail(function() {
			self.changeElementContent('<div class="wps-error">An error occured while connecting to '+
					self.settings.url +'</div>');
		});
	}
});
