var wps;

function resolveRequest(type, method, settings) {
	if (type == GET_CAPABILITIES_TYPE) {
		return new GetCapabilitiesGetRequest(settings);
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
	var params = jQuery.url();
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
		dataValid = jQuery.isXMLDoc(settings.data);
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
		
		jQuery('#'+originalRequest.updateSwitch.element).click(function() {
			
			var updateSwitch = originalRequest.updateSwitch;
			
			var getSettings = {
				url : originalRequest.settings.url,
				requestType : originalRequest.settings.requestType,
				type : "GET",
				domElement : originalRequest.settings.domElement
			};
			
			originalRequest = new GetRequest(getSettings);
			originalRequest.execute(updateSwitch.callback, updateSwitch);
		});
		jQuery('#'+originalRequest.updateSwitch.element).css( 'cursor', 'pointer' );
	}
}

function removePocessesFromSelectFast(){
	var selectObj = document.getElementById("processes");
	var selectParentNode = selectObj.parentNode;
	var newSelectObj = selectObj.cloneNode(false); // Make a shallow copy
	selectParentNode.replaceChild(newSelectObj, selectObj);
    
    var option = document.createElement("option");
    option.innerHTML = "Select a process";
    option.value = "Select a process";
    newSelectObj.appendChild(option);	
    newSelectObj.onchange = describeProcess;
	return newSelectObj;
}

// using OpenLayers.Format.WPSCapabilities to read the capabilities
// and fill available process list
function getCapabilities() {
    
	jQuery.wpsSetup({configuration : {url : this.options[this.selectedIndex].value}});
//    wps = this.options[this.selectedIndex].value;
    
    removePocessesFromSelectFast();
    
    var getCap = new GetCapabilitiesGetRequest({
    	url : wps.getServiceUrl()
    });
    
    getCap.execute(function(response, targetDomElement, originalRequest, updateSwitch) {
    	//TODO read response with GetCapabilitiesResponse.js
        capabilities = new OpenLayers.Format.WPSCapabilities().read(
                response);
        var dropdown = document.getElementById("processes");
        var offerings = capabilities.processOfferings, option;
        // populate the dropdown
        for (var p in offerings) {
            option = document.createElement("option");
            option.innerHTML = offerings[p].identifier;
            option.value = p;
            dropdown.appendChild(option);				
        }
    });
    
}

// using OpenLayers.Format.WPSDescribeProcess to get information about a
// process
function describeProcess(processIdentifier, wpsUrl, targetContainer) {
	if (!processIdentifier) {
		processIdentifier = this.options[this.selectedIndex].value;		
	}
	
	if (!wpsUrl) {
		wpsUrl = wps;
	}
	
	if (!targetContainer) {
		targetContainer = "wps-execute-container";
	}
    
    var describeProcess = new DescribeProcessGetRequest({
    	url : wpsUrl,
    	processIdentifier: processIdentifier
    });
    
    describeProcess.execute(function(response, targetDomElement, originalRequest, updateSwitch) {
    	//TODO read response with DescribeProcessResponse.js
            var parsed = new OpenLayers.Format.WPSDescribeProcess().read(
                response
            );
            
            var process = parsed.processDescriptions[processIdentifier];
            
            var formBuilder = new FormBuilder();
            formBuilder.clearForm(jQuery('#'+targetContainer));
            formBuilder.buildExecuteForm(jQuery('#'+targetContainer), process, execute);
        });
    
}

// execute the process
function execute(formId, wpsUrl) {
    var formValues = jQuery('#'+formId).serializeArray();
    
    var parser = new FormParser();
    var inputs = parser.parseInputs(formValues);
    var outputs = parser.parseOutputs(formValues);
    var processIdentifier = parser.parseProcessIdentifier(formValues);
    var outputStyle = parser.parseOutputStyle(formValues);
    
    if (!wpsUrl) {
    	wpsUrl = wps.getServiceUrl();
    }
    
    var settings = {
			url: wpsUrl,
			inputs: inputs,
			outputs: outputs,
			outputStyle: outputStyle,
			processIdentifier: processIdentifier,
			domElement: jQuery('#executeProcess')
	};

	var originalRequest = new ExecuteRequest(settings);

	originalRequest.execute(callbackOnResponseParsed, {});
}

/*
 * jQuery plugin definitions
 */
(function(jQuery) {

	jQuery.fn.extend({
		wpsCall : function( options ) {
	    	var settings;
	    	if (options && options.viaUrl) {
	    		/*
	    		 * Call via GET parameters
	    		 */
	    		settings = jQuery.extend(resolveGetParameters(), {method: METHOD_GET});
	    	}
	    	else {
	            /*
	             * Custom User Call
	             */
	            settings = jQuery.extend({
	                method: METHOD_GET
	            }, options);
	    	}
	    	
	    	if (assertValidState(settings)) {
	    		return this.each( function() {
	            	var requestSettings = jQuery.extend({
	                    domElement: jQuery(this)
	                }, settings);
	            	
	            	var request = resolveRequest(requestSettings.requestType, requestSettings.method,
	            			requestSettings);
	            	request.execute(callbackOnResponseParsed, options.updateSwitch);
	            });	
	    	}
	    	
	    	return this.each();
	    }
	});
	
	jQuery.extend({
		wpsSetup : function(setup) {
			if (setup.reset) {
				wpsResetSetup();
				return;
			}
			
	    	if (setup.templates) {
	    		var templates = setup.templates;
	    		if (templates.capabilities) {
	    			if (typeof templates.capabilities == 'string') {
	    				USER_TEMPLATE_CAPABILITIES_MARKUP = templates.capabilities;
	    			}
	        	}
	        	if (templates.processDescription) {
	        		if (typeof templates.processDescription == 'string') {
	        			USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP = templates.processDescription;
	        		}
	        	}
	        	if (templates.executeResponse) {
	        		if (typeof templates.executeResponse == 'string') {
	        			USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP = templates.executeResponse;
	        		}
	        	}
	    	}
	    	
	    	if (setup.proxy) {
	    		USE_PROXY = true;
	    		PROXY_URL = setup.proxy.url;
	    		/*
	    		 * setup OpenLayers to use the proxy as well
	    		 */
	    		if (OpenLayers) {
	    			OpenLayers.ProxyHost = setup.proxy.url;
	    		}
	    		PROXY_TYPE = setup.proxy.type;
	    	}
	    	
	    	if (setup.configuration) {
	    		wps = new WPSConfiguration(setup.configuration);
	    	}

		}
	});
    
}(jQuery));

