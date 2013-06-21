
function resolveRequest(type, method, settings) {
	if (type == GET_CAPABILITIES_TYPE) {
		return new GetRequest(settings);
	}
	else if (type == DESCRIBE_PROCESS_TYPE) {
		return new GetRequest(settings);
	}
	else if (type == EXECUTE_TYPE && method == METHOD_POST) {
		return new PostRequest(settings);
	}
	
	return new GetRequest(settings);
}

function resolveGetParameters() {
	var params = $.url();
	var url = params.param(PARAM_WPS_REQUEST_URL);
	var requestType = params.param(PARAM_WPS_REQUEST_TYPE);
	
	if (url && requestType) {
		return {url: decodeURIComponent((url+'').replace(/\+/g, '%20')), requestType: requestType};
	}

	return null;
}

function assertValidState(settings) {
	var dataValid = true;
	if (settings.method == METHOD_POST) {
		dataValid = $.isXMLDoc(settings.data);
	}
	return settings.url && settings.requestType && settings.method && dataValid;
}

function callbackOnResponseParsed(responseData, domElement, originalRequest) {
	var factory = new ResponseFactory();
	var responseHandler = factory.resolveResponseHandler(responseData, originalRequest);
	
	if (responseHandler) {
		domElement.html(responseHandler.createMarkup());
	}
	
	if (originalRequest.updateSwitch) {
		if (!originalRequest.updateSwitch.callback) {
			originalRequest.updateSwitch.callback = callbackOnResponseParsed;
		}
		if (!originalRequest.updateSwitch.element) {
			originalRequest.updateSwitch.element = "wps-execute-autoUpdate";
		}
		
		$('#'+originalRequest.updateSwitch.element).click(function() {
			alert(originalRequest.settings.url);
			originalRequest.execute(originalRequest.updateSwitch.callback, originalRequest.updateSwitch);
		});
		$('#'+originalRequest.updateSwitch.element).css( 'cursor', 'pointer' );
	}
}

/*
 * jQuery plugin definitions
 */
(function($) {


    $.fn.wpsCall = function( options ) {
    	var settings;
    	if (options && options.viaUrl) {
    		/*
    		 * Call via GET parameters
    		 */
    		settings = $.extend(resolveGetParameters(), {method: METHOD_GET});
    	}
    	else {
            /*
             * Custom User Call
             */
            settings = $.extend({
                method: METHOD_GET
            }, options);
    	}
    	
    	if (assertValidState(settings)) {
    		return this.each( function() {
            	var requestSettings = $.extend({
                    domElement: $(this)
                }, settings);
            	
            	var request = resolveRequest(requestSettings.requestType, requestSettings.method,
            			requestSettings);
            	request.execute(callbackOnResponseParsed, options.updateSwitch);
            });	
    	}
    	
    	return this.each();
    }
    
    $.wpsSetup = function(setup) {
    	if (setup.templates) {
    		var templates = setup.templates;
    		if (templates.capabilities && typeof templates.capabilities == 'string' ) {
        		TEMPLATE_CAPABILITIES_MARKUP = templates.capabilities;
        	}
        	if (templates.processDescription && typeof templates.processDescription == 'string' ) {
        		TEMPLATE_PROCESS_DESCRIPTION_MARKUP = templates.processDescription;
        	}
        	if (templates.executeResponse && typeof templates.executeResponse == 'string' ) {
        		TEMPLATE_EXECUTE_RESPONSE_MARKUP = templates.executeResponse;
        	}
    	}
    	
    	if (setup.proxy) {
    		USE_PROXY = true;
    		PROXY_URL = setup.proxy.url;
    		PROXY_TYPE = setup.proxy.type;
    	}
    }

}(jQuery));
