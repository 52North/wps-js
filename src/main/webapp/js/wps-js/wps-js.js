
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
			originalRequest.execute(originalRequest.updateSwitch.callback, originalRequest.updateSwitch);
		});
		$('#'+originalRequest.updateSwitch.element).css( 'cursor', 'pointer' );
	}
}

// using OpenLayers.Format.WPSCapabilities to read the capabilities
function getCapabilities() {
    OpenLayers.Request.GET({
        url: wps,
        params: {
            "SERVICE": "WPS",
            "REQUEST": "GetCapabilities"
        },
        success: function(response){
            capabilities = new OpenLayers.Format.WPSCapabilities().read(
                response.responseText
            );
            var dropdown = document.getElementById("processes");
            var offerings = capabilities.processOfferings, option;
            // populate the dropdown
            for (var p in offerings) {
				if((p.indexOf("JTS") !== -1)){
                option = document.createElement("option");
                option.innerHTML = offerings[p].identifier;
                option.value = p;
                dropdown.appendChild(option);
				}
            }
        }
    });
}

// using OpenLayers.Format.WPSDescribeProcess to get information about a
// process
function describeProcess() {
    var selection = this.options[this.selectedIndex].value;
    OpenLayers.Request.GET({
        url: wps,
        params: {
            "SERVICE": "WPS",
            "REQUEST": "DescribeProcess",
            "VERSION": capabilities.version,
            "IDENTIFIER": selection
        },
        success: function(response) {
            process = new OpenLayers.Format.WPSDescribeProcess().read(
                response.responseText
            ).processDescriptions[selection];
            buildForm();
        }
    });
}

// dynamically create a form from the process description
function buildForm() {
    document.getElementById("abstract").innerHTML = process["abstract"];
    document.getElementById("input").innerHTML = "<h3>Input:</h3>";
    document.getElementById("output").innerHTML = "";

    var inputs = process.dataInputs, supported = true,
        sld = "text/xml; subtype=sld/1.0.0",
        input;
    for (var i=0,ii=inputs.length; i<ii; ++i) {
        input = inputs[i];
        if (input.complexData) {
            var formats = input.complexData.supported.formats;
            if (formats["application/wkt"]) {
                addWKTInput(input);
            } else if (formats["text/xml; subtype=wfs-collection/1.0"]) {
                addWFSCollectionInput(input);
            } else if (formats["image/tiff"]) {
                addRasterInput(input);
            } else if (formats[sld]) {
                addXMLInput(input, sld);
            } else {
                supported = false;
            }
        } else if (input.boundingBoxData) {
            addBoundingBoxInput(input);
        } else if (input.literalData) {
            addLiteralInput(input);
        } else {
            supported = false;
        }
        if (input.minOccurs > 0) {
            document.getElementById("input").appendChild(document.createTextNode("* "));
        }
    }
    
    if (supported) {
        var executeButton = document.createElement("button");
        executeButton.innerHTML = "Execute";
        document.getElementById("input").appendChild(executeButton);
        executeButton.onclick = execute;
    } else {
        document.getElementById("input").innerHTML = '<span class="notsupported">' +
            "Sorry, the WPS builder does not support the selected process." +
            "</span>";
    }
}

// helper function to dynamically create a textarea for geometry (WKT) data
// input
function addWKTInput(input, previousSibling) {
    var name = input.identifier;
    var container = document.getElementById("input");
    var label = document.createElement("label");
    label["for"] = name;
    label.title = input["abstract"];
    label.innerHTML = name + " (select feature, then click field):";
    previousSibling && previousSibling.nextSibling ?
        container.insertBefore(label, previousSibling.nextSibling) :
        container.appendChild(label);
    var field = document.createElement("textarea");
    field.onclick = function () {
        if (layer.selectedFeatures.length) {
            this.innerHTML = new OpenLayers.Format.WKT().write(
                layer.selectedFeatures[0]
            );
        }
        createCopy(input, this, addWKTInput);
    };
    field.onblur = function() {
        input.data = field.value ? {
            complexData: {
                mimeType: "application/wkt",
                value: this.value
            }
        } : undefined;
    };
    field.title = input["abstract"];
    field.id = name;
    previousSibling && previousSibling.nextSibling ?
        container.insertBefore(field, previousSibling.nextSibling.nextSibling) :
        container.appendChild(field);
}

// helper function for xml input
function addXMLInput(input, type) {
    var name = input.identifier;
    var field = document.createElement("input");
    field.title = input["abstract"];
    field.value = name + " (" + type + ")";
    field.onblur = function() {
        input.data = field.value ? {
            complexData: {
                mimeType: type,
                value: this.value
            }
        } : undefined;
    };
    document.getElementById("input").appendChild(field);
}

// helper function to dynamically create a WFS collection reference input
function addWFSCollectionInput(input) {
    var name = input.identifier;
    var field = document.createElement("input");
    field.title = input["abstract"];
    field.value = name + " (layer on demo server)";
    addValueHandlers(field, function() {
        input.reference = field.value ? {
            mimeType: "text/xml; subtype=wfs-collection/1.0",
            href: "http://geoserver/wfs",
            method: "POST",
            body: {
                wfs: {
                    version: "1.0.0",
                    outputFormat: "GML2",
                    featureType: field.value
                }
            }
        } : undefined;
    });
    document.getElementById("input").appendChild(field);
}

// helper function to dynamically create a raster (GeoTIFF) url input
function addRasterInput(input) {
    var name = input.identifier;
    var field = document.createElement("input");
    field.title = input["abstract"];
    var url = window.location.href.split("?")[0];
    field.value = url.substr(0, url.lastIndexOf("/")+1) + "data/tazdem.tiff";
    document.getElementById("input").appendChild(field);
    (field.onblur = function() {
        input.reference = {
            mimeType: "image/tiff",
            href: field.value,
            method: "GET"
        };
    })();
}

// helper function to dynamically create a bounding box input
function addBoundingBoxInput(input) {
    var name = input.identifier;
    var field = document.createElement("input");
    field.title = input["abstract"];
    field.value = "left,bottom,right,top (EPSG:4326)";
    document.getElementById("input").appendChild(field);
    addValueHandlers(field, function() {
        input.boundingBoxData = {
            projection: "EPSG:4326",
            bounds: OpenLayers.Bounds.fromString(field.value)
        };
    });
}

// helper function to create a literal input textfield or dropdown
function addLiteralInput(input, previousSibling) {
    var name = input.identifier;
    var container = document.getElementById("input");
    var anyValue = input.literalData.anyValue;
    // anyValue means textfield, otherwise we create a dropdown
    var field = document.createElement(anyValue ? "input" : "select");
    field.id = name;
    field.title = input["abstract"];
    previousSibling && previousSibling.nextSibling ?
        container.insertBefore(field, previousSibling.nextSibling) :
        container.appendChild(field);
    if (anyValue) {
        var dataType = input.literalData.dataType;
        field.value = name + (dataType ? " (" + dataType + ")" : "");
        addValueHandlers(field, function() {
            input.data = field.value ? {
                literalData: {
                    value: field.value
                }
            } : undefined;
            createCopy(input, field, addLiteralInput);
        });
    } else {
        var option;
        option = document.createElement("option");
        option.innerHTML = name;
        field.appendChild(option);
        for (var v in input.literalData.allowedValues) {
            option = document.createElement("option");
            option.value = v;
            option.innerHTML = v;
            field.appendChild(option);
        }
        field.onchange = function() {
            createCopy(input, field, addLiteralInput);
            input.data = this.selectedIndex ? {
                literalData: {
                    value: this.options[this.selectedIndex].value
                }
            } : undefined;
        };
    }
}

// if maxOccurs is > 1, this will add a copy of the field
function createCopy(input, field, fn) {
    if (input.maxOccurs && input.maxOccurs > 1 && !field.userSelected) {
        // add another copy of the field - we don't check maxOccurs
        field.userSelected = true;
        var newInput = OpenLayers.Util.extend({}, input);
        // we recognize copies by the occurrence property
        newInput.occurrence = (input.occurrence || 0) + 1;
        process.dataInputs.push(newInput);
        fn(newInput, field);
    }
}

// helper function for adding events to form fields
function addValueHandlers(field, onblur) {
    field.onclick = function() {
        if (!this.initialValue) {
            this.initialValue = this.value;
            this.value = "";
        }
    };
    field.onblur = function() {
        if (!this.value) {
            this.value = this.initialValue;
            delete this.initialValue;
        }
        onblur.apply(this, arguments);
    };
}

// execute the process
function execute() {
    var output = process.processOutputs[0];
    var input;
    // remove occurrences that the user has not filled out
    for (var i=process.dataInputs.length-1; i>=0; --i) {
        input = process.dataInputs[i];
        if ((input.minOccurs === 0 || input.occurrence) && !input.data && !input.reference) {
            OpenLayers.Util.removeItem(process.dataInputs, input);
        }
    }
    process.responseForm = {
        rawDataOutput: {
            identifier: output.identifier
        }
    };
    if (output.complexOutput && output.complexOutput.supported.formats["application/wkt"]) {
        process.responseForm.rawDataOutput.mimeType = "application/wkt";
    }
    OpenLayers.Request.POST({
        url: wps,
        data: new OpenLayers.Format.WPSExecute().write(process),
        success: showOutput
    });
}

// add the process's output to the page
function showOutput(response) {
    var result = document.getElementById("output");
    result.innerHTML = "<h3>Output:</h3>";
    var features;
    var contentType = response.getResponseHeader("Content-Type");
    if (contentType == "application/wkt") {
        features = new OpenLayers.Format.WKT().read(response.responseText);
    } else if (contentType == "text/xml; subtype=wfs-collection/1.0") {
        features = new OpenLayers.Format.WFST.v1_0_0().read(response.responseText);
    }
    if (features && (features instanceof OpenLayers.Feature.Vector || features.length)) {
        layer.addFeatures(features);
        result.innerHTML += "The result should also be visible on the map.";
    }
    result.innerHTML += "<textarea>" + response.responseText + "</textarea>";
}

/*
 * jQuery plugin definitions
 */
(function($) {

	$.fn.extend({
		wpsCall : function( options ) {
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
	});
	
	$.extend({
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
	    		PROXY_TYPE = setup.proxy.type;
	    	}
	    }
	});
    

}(jQuery));
