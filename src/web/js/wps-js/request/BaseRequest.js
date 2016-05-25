
var BaseRequest = Class.extend({
	init : function(settings) {
		this.settings = settings;
	},

	getSettings : function() {
		return this.settings;
	},

	execute : function(callback, updateSwitch) {
		/*
		 * define a callback which gets called after finishing the request
		 */
		this.callback = callback;
		
		this.updateSwitch = updateSwitch;
		
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
		if (this.settings.domElement) {
			this.settings.domElement.html(htmlContent);
		}
	},
	
	prepareHTTPRequest : function() {
		return null;
	},

	executeHTTPRequest : function(requestSettings) {
		/*
		 * we need 'self' as 'this' is different in the
		 * anonymous callbacks
		 */
		var self = this;
		
		var combinedRequestSettings = jQuery.extend({
			success : function(data) {
				if (self.callback) {
					self.callback(data, self.settings.domElement, self, self.updateSwitch);
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
		
		var targetUrl;
		if (USE_PROXY) {
			if (PROXY_TYPE == "parameter") {
				targetUrl = PROXY_URL + encodeURIComponent(this.settings.url);
			}
			else {
				//TODO split URL into host-base + query and create new
				targetUrl = this.settings.url;
			} 
		} else {
			targetUrl = this.settings.url;
		}
		jQuery.ajax(targetUrl, combinedRequestSettings);
	}
});
