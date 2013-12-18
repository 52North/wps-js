var TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP = '\
	<div class="wps-execute-complex-inputs"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list" id="complex-inputs"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}{{html asReference}}</li> \
				<li class="wps-execute-response-list-entry"> \
					{{html formats}}{{html copyButton}}</li> \
			</ul> \
		</div> \
	</div>';

var TEMPLATE_EXECUTE_COMPLEX_INPUTS_COPY_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}{{html asReference}}</li> \
				<li class="wps-execute-response-list-entry"> \
					{{html formats}}</li>';

var TEMPLATE_EXECUTE_LITERAL_INPUTS_MARKUP = '\
	<div class="wps-execute-complex-inputs"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list" id="literal-inputs"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}{{html copyButton}}</li> \
			</ul> \
		</div> \
	</div>';
	
var TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}</li>';


var TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP = '\
	<div class="wps-execute-complex-inputs"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list" id="bbox-inputs"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}<label>${description}</label>{{html copyButton}}</li> \
			</ul> \
		</div> \
	</div>';

var TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}<label>${description}</label></li>';

var TEMPLATE_EXECUTE_OUTPUTS_MARKUP = '\
	<div class="wps-execute-complex-inputs"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list" id="outputs"> \
			</ul> \
		</div> \
	</div>';

var TEMPLATE_EXECUTE_COMPLEX_OUTPUTS_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}</label>{{html shouldBeRequested}}</li> \
				<li class="wps-execute-response-list-entry"> \
					{{html formats}}</li>';


var TEMPLATE_EXECUTE_LITERAL_OUTPUTS_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}</label>{{html shouldBeRequested}}</li>';

var TEMPLATE_EXECUTE_BBOX_OUTPUTS_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}</label>{{html shouldBeRequested}}</li>';

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
    
    wps = this.options[this.selectedIndex].value;
    
    removePocessesFromSelectFast();
    
    var getCap = new GetCapabilitiesGetRequest({
    	url : wps
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
    
//    OpenLayers.Request.GET({
//        url: wps,
//        params: {
//            "SERVICE": "WPS",
//            "REQUEST": "GetCapabilities"
//        },
//        success: function(response){
//            capabilities = new OpenLayers.Format.WPSCapabilities().read(
//                response.responseText
//            );
//            var dropdown = document.getElementById("processes");
//            var offerings = capabilities.processOfferings, option;
//            // populate the dropdown
//            for (var p in offerings) {
//                option = document.createElement("option");
//                option.innerHTML = offerings[p].identifier;
//                option.value = p;
//                dropdown.appendChild(option);				
//            }
//        }
//    });
}

// using OpenLayers.Format.WPSDescribeProcess to get information about a
// process
function describeProcess() {
    var selection = this.options[this.selectedIndex].value;
    
    var describeProcess = new DescribeProcessGetRequest({
    	url : wps,
    	processIdentifier: selection
    });
    
    describeProcess.execute(function(response, targetDomElement, originalRequest, updateSwitch) {
    	//TODO read response with DescribeProcessResponse.js
            var parsed = new OpenLayers.Format.WPSDescribeProcess().read(
                response
            );
            
            var process = parsed.processDescriptions[selection];
            
            clearForm(jQuery('#wps-execute-container'));
            buildForm(jQuery('#wps-execute-container'), process);
        });
    
//    OpenLayers.Request.GET({
//        url: wps,
//        params: {
//            "SERVICE": "WPS",
//            "REQUEST": "DescribeProcess",
//            "VERSION": capabilities.version,
//            "IDENTIFIER": selection
//        },
//        success: function(response) {
//            process = new OpenLayers.Format.WPSDescribeProcess().read(
//                response.responseText
//            ).processDescriptions[selection];
//            buildForm();
//        }
//    });
}

function clearForm(targetDiv) {
	targetDiv.html('');
}

// dynamically create a form from the process description
function buildForm(targetDiv, processDescription) {
    jQuery("#abstract").html(processDescription["abstract"]);

 	var supported = true;
 	
 	var formElement = jQuery('<form id="wps-execute-form"></form>');
 	formElement.submit(function() {
        	execute("wps-execute-form");
        	return false;
        });
 	formElement.append(createFormInputs(processDescription.dataInputs));
	formElement.append(createFormOutputs(processDescription));
 	formElement.append(jQuery('<input type="hidden" name="processIdentifier" value="'+processDescription.identifier+'" />'));
	targetDiv.append(formElement);
        
    if (supported) {
        var executeButton = jQuery("<button>ExeCUTE</button>");
        formElement.append(executeButton);
    } else {
        document.getElementById("input").innerHTML = '<span class="notsupported">' +
            "Sorry, this client does not support the selected process." +
            "</span>";
    }
}

function createFormInputs(inputs){
    
    var container = jQuery('<div id="input"></div>');
    var complexContainer = jQuery('<div id="complex-inputs"/>');
    var literalContainer = jQuery('<div id="literal-inputs"/>');
    var bboxContainer = jQuery('<div id="bbox-inputs"/>');
    container.append(complexContainer);
    container.append(literalContainer);
    container.append(bboxContainer);
    
    var input;
    for (var i=0; i < inputs.length; i++) {
        input = inputs[i];    
                
        if (input.complexData) {    		    		
			createInput(input, container, TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP, TEMPLATE_EXECUTE_COMPLEX_INPUTS_COPY_MARKUP, "complex-inputs", createComplexInput);       	   
        } else if (input.boundingBoxData) {            
            createInput(input, container, TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP, TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP, "bbox-inputs", createBoundingBoxInput);               
        } else if (input.literalData) {
            createInput(input, container, TEMPLATE_EXECUTE_LITERAL_INPUTS_MARKUP, TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP, "literal-inputs", createLiteralInput);
        }
    }
    
    return container;	
}

function createInput(input, container, template, copyTemplate, inputParentId, propertyCreationFunction){

    var templateProperties = propertyCreationFunction(input);
    
    if (input.minOccurs > 0) {
        templateProperties.required = "*";
    }
    	
    var name = input.identifier;
    
    var button = null;
    if (input.maxOccurs > 1) {
    
    	var copyButtonDiv = jQuery("<div></div>"); 
    
    	button = addInputCopyButton(name);    	
    
		copyButtonDiv.append(button);
		templateProperties.copyButton = copyButtonDiv.html();
    }
    
    jQuery.tmpl(template, templateProperties).appendTo(container);
              
    if (input.maxOccurs > 1) {
    
    	if (button) {
    		button.onclick = function() { 
    			var templateProperties = createCopy(input, propertyCreationFunction);
    		
    			if (templateProperties) {				
    				var inputsUl = jQuery('#'+inputParentId);
    				jQuery.tmpl(copyTemplate, templateProperties).appendTo(inputsUl);
    			}
    		};	
    	}
	
	}

}

// helper function for xml input
function createComplexInput(input) {
    
    var complexInputElements = {};
    
    var name = input.identifier;        
    
    var fieldDiv = jQuery("<div/>"); 
    
    var field = jQuery('<textarea class="wps-complex-input-textarea" title="'+ input["abstract"] +'"/>');
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 

    var inputType;
    var fieldName;
    if(input.maxOccurs > 1){
    	fieldName = "input_"+ name + number;
    }else {
    	fieldName = "input_"+ name;
    }
    
    field.attr("name", fieldName);
	inputType = createInputTypeElement("complex", fieldName);
    
    field.attr("title", input["abstract"]);
    
    fieldDiv.append(field);
    fieldDiv.append(inputType);
    
    var labelText = "";
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText = input.identifier;
    }
        
    var formats = input.complexData.supported.formats;
    var formatDropBox = createFormatDropdown("format_"+fieldName, formats, input); 
    
    var formatDropBoxDiv = jQuery("<div />"); 
      
    formatDropBoxDiv.append(formatDropBox);
      
    var checkBoxDiv = jQuery('<div />'); 
    
    var checkBox = jQuery('<input type="checkbox" name="checkbox_'+fieldName + '" value="asReference"/>');
    
    checkBoxDiv.append(checkBox);
    checkBoxDiv.append("asReference");
    
    complexInputElements.identifier = labelText;
    complexInputElements.inputField = fieldDiv.html();
    complexInputElements.asReference = checkBoxDiv.html();
    complexInputElements.formats = formatDropBoxDiv.html();
    
    return complexInputElements;    
}

// helper function to create a literal input textfield or dropdown
function createLiteralInput(input) {
    
    var literalInputElements = {};        
    
    var fieldDiv = jQuery("<div />"); 
    
    var labelText = "";
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 
    
    var name = input.identifier;
    
    var fieldName = "input_"+ name + number;
    var anyValue = input.literalData.anyValue;
    // anyValue means textfield, otherwise we create a dropdown
    var field = anyValue ? jQuery("<input />") : jQuery("<select />");    
    
    field.attr("name", fieldName);
    var inputType = createInputTypeElement("literal", fieldName);

    field.attr("title", input["abstract"]);
    
    fieldDiv.append(field);
    fieldDiv.append(inputType);
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText = input.identifier;
    }
    
    if (anyValue) {
        var dataType = input.literalData.dataType;
    } else {
        var option = jQuery("<option />");
        //option.innerHTML = name;
        field.append(option);
        for (var v in input.literalData.allowedValues) {
            option = jQuery("<option />");
            option.attr("value", v);
            option.html(v);
            field.append(option);
        }
    
   		if(input.literalData.defaultValue){
   			field.attr("value", input.literalData.defaultValue); 
   		}
    }
    
    literalInputElements.identifier = labelText;
    literalInputElements.inputField = fieldDiv.html();
    
    return literalInputElements; 
}

// helper function to dynamically create a bounding box input
function createBoundingBoxInput(input) {
    
    var bboxInputElements = {};        
    
    var fieldDiv = jQuery("<div />"); 
    
    var labelText = "";
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 
    
    var name = input.identifier;
    
    var fieldName = "input_"+ name + number;
    var field = jQuery("<input />");
    field.attr("title", input["abstract"]);

    field.attr("name", fieldName);
    var inputType = createInputTypeElement("bbox", fieldName);

    field.attr("title", input["abstract"]);    
    
    fieldDiv.append(field);
    fieldDiv.append(inputType);
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText= input.identifier;
    }
    
    bboxInputElements.identifier = labelText;
    bboxInputElements.inputField = fieldDiv.html();
    bboxInputElements.description = "left, bottom, right, top";
	
	return bboxInputElements;
}

function createInputTypeElement(theType, theId) {
	var typeInput = jQuery('<input type="hidden" value="'+theType+'" name="type_'+theId+ '" />');
	
	return typeInput;
}


function createFormOutputs(processDescription){
	var container = jQuery('<div id="output"></div>');
    
	jQuery.tmpl(TEMPLATE_EXECUTE_OUTPUTS_MARKUP, "").appendTo(container);
	
	var outputsUl = jQuery('<ul id="outputs" class="wps-execute-response-list"/>');
	container.append(outputsUl);
	
	var outputs = processDescription.processOutputs;
	
	for (var i = 0; i < outputs.length; i++) {
		var output = outputs[i];
		
    	var id = "output_"+output.identifier;
    	
    	var templateProperties = {};
    	
    	var template = null;
    	
    	var checkBoxDiv = jQuery("<div />");
    	
    	var checkBox = jQuery('<input type="checkbox"/>');
    	checkBox.attr("name", id);
    	var typeField = createInputTypeElement(output.complexOutput ? "complex" : "literal", id);
    	
    	checkBoxDiv.append(checkBox);
    	checkBoxDiv.append(typeField);
    	
    	templateProperties.identifier = id;
    	templateProperties.shouldBeRequested = checkBoxDiv.html();
    	
    	if (output.complexOutput) {
    		var formats = output.complexOutput.supported.formats;
    		
    		var formatDropBox = createFormatDropdown("format_"+id, formats, output);
    		
    		var formatDropBoxDiv = jQuery("<div />");
    		
    		formatDropBoxDiv.append(formatDropBox);
    		    		
    		templateProperties.formats = formatDropBoxDiv.html();
    		
    		template = TEMPLATE_EXECUTE_COMPLEX_OUTPUTS_MARKUP;
    		
    	} else if (output.literalOutput) {
    		
    		template = TEMPLATE_EXECUTE_LITERAL_OUTPUTS_MARKUP;
    	
    	} else if (output.boundingBoxOutput) {
    		
    		template = TEMPLATE_EXECUTE_BBOX_OUTPUTS_MARKUP;    	
    	}
    	
    	if (template) {
    		jQuery.tmpl(template, templateProperties).appendTo(outputsUl);
    	}
	}
	
	return container;
}

function createFormatDropdown(id, formats, input){

    // anyValue means textfield, otherwise we create a dropdown
    var field = jQuery('<select name="'+id+'" title="'+input["abstract"]+'"/>');
    
    var option;
    for (var i = 0; i < formats.length; i++) {
    	var format = formats[i];
    	//var formatString = format.schema + "; " + format.mimeType + "; " + format.encoding;
    	
    	//if these exist, append semicolon, else make empty string
    	var schema = format.schema;
    	var encoding = format.encoding;
    	var mimeType = format.mimeType;
    	
    	var formatString = "";
    	
    	//mimeType is mandatory, schema and encoding are not
    	if(schema && encoding){
    		formatString = mimeType + "; " + schema + "; " + encoding;
    	}else if(!schema && encoding){
    		formatString = mimeType + "; " + encoding;
    	}else if(schema && !encoding){
    		formatString = mimeType + "; " + schema;
    	}else{
    		formatString = mimeType;
    	}
    	
    	//var formatString = format.mimeType + schema + encoding;
        option = jQuery('<option value="'+JSON.stringify(format)+'">'+formatString+'</option>');
        field.append(option);
    }
	return field;
}

function addInputCopyButton(id){
	var button = jQuery('<button class="add-input-copy" id="'+id+'-copy-button" />');
	return button;
}

// if maxOccurs is > 1, this will add a copy of the field
function createCopy(input, propertyCreationFunction) {
    if (input.maxOccurs && input.maxOccurs > 1) {
        // add another copy of the field - check maxOccurs
        if(input.occurrence && input.occurrence >= input.maxOccurs){
        	return;
        }
        var newInput = jQuery.extend({}, input);
        // we recognize copies by the occurrence property
        input.occurrence = (input.occurrence || 1) + 1;
        newInput.occurrence = input.occurrence;
        return propertyCreationFunction(newInput);
    }
}


// execute the process
function execute(formId) {
    var formValues = jQuery('#'+formId).serializeArray();
    
    var parser = new FormParser();
    var inputs = parser.parseInputs(formValues);
    var outputs = parser.parseOutputs(formValues);
    var processIdentifier = parser.parseProcessIdentifier(formValues);
    var outputStyle = parser.parseOutputStyle(formValues);
    
    var settings = {
			url: wps,
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
	    		
	    	}

		}
	});
    
}(jQuery));

