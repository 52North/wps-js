var BaseRequest = Class.extend({
	init : function(settings) {
		this.settings = settings;
		
		this.addRequestTypeToSettings();
	},
	
	addRequestTypeToSettings: function(){
		//override this method to add a request type to the settings object 
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
	},

	postRequestExecution : function() {

	},

	processResponse : function(xml) {

	},

	prepareHTTPRequest : function() {
		return null;
	},

	executeHTTPRequest : function(requestSettings) {
		/*
		 * we need 'self' as 'this' is different in the anonymous callbacks
		 */
		var self = this;

		var combinedRequestSettings = jQuery.extend({
			success : function(responseData) {
				/*
				 * create an appropriate response document (which depends on the
				 * request type)
				 */
				var respFactory = new ResponseFactory();
				var response = respFactory.resolveResponseHandler(responseData,
						self);

				/*
				 * if a callback function has been defined, then call it with
				 * the response object
				 */
				if (self.callback) {
					self.callback(response);
				}

				return response;
			},
			error : function(jqXHR, textStatus, errorThrown) {
				/*
				 * error handling, return textStatus and errorThrown as new
				 * object
				 */

				var errorResponse = {
					textStatus : textStatus,
					errorThrown : errorThrown
				}
				
				/*
				 * if a callback function has been defined, then call it with
				 * the response object
				 */
				if (self.callback) {
					self.callback(errorResponse);
				}
				
			}
		}, requestSettings);

		var targetUrl;
		if (USE_PROXY) {
			if (PROXY_TYPE == "parameter") {
				targetUrl = PROXY_URL + encodeURIComponent(this.settings.url);
			} else {
				// TODO split URL into host-base + query and create new
				targetUrl = this.settings.url;
			}
		} else {
			targetUrl = this.settings.url;
		}
		jQuery.ajax(targetUrl, combinedRequestSettings);
	}
});
