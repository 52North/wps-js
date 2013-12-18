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
//	formElement.append(createFormOutputs(processDescription));
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

function addOutputs(){
    var container = document.getElementById("input");
	var outputs = process.processOutputs;
	
	for (var i = 0; i < outputs.length; i++) {		
    	var output = outputs[i];
    	var id = output.identifier;
    	var label = document.createElement("label");
    	label.className = "wps-input-item-label";
    	label.innerHTML = id;
    	
    	var checkBox = document.createElement("input");
    	checkBox.type = "checkbox";
    	checkBox.id = id + "-checkbox";
    
    	container.appendChild(label);
    	container.appendChild(checkBox);
    	container.appendChild(document.createElement("p"));
    	
    	if(output.complexOutput){
    	
    		var formats = output.complexOutput.supported.formats;
    		
    		var formatDropBox = createFormatDropdown(id + "formats", formats);
    		
    		container.appendChild(formatDropBox);
    		container.appendChild(document.createElement("p"));
    		
    	}
	}
}

function createFormOutputs(processDescription){
    
    var container = document.getElementById("input");
    
	jQuery.tmpl(TEMPLATE_EXECUTE_OUTPUTS_MARKUP, "").appendTo(container);
	
	var outputsUl = document.getElementById("outputs");
	
	var outputs = processDescription.processOutputs;
	
	for (var i = 0; i < outputs.length; i++) {
		var output = outputs[i];
		
    	var id = output.identifier;
    	
    	var templateProperties = {};
    	
    	var template;
    	
    	var checkBoxDiv = document.createElement("div");
    	
    	var checkBox = document.createElement("input");
    	checkBox.type = "checkbox";
    	checkBox.id = id + "-checkbox";
    	
    	checkBoxDiv.appendChild(checkBox);
    	
    	templateProperties.identifier = id;
    	templateProperties.shouldBeRequested = checkBoxDiv.innerHTML;
    	
    	if(output.complexOutput){
    	
    		var formats = output.complexOutput.supported.formats;
    		
    		var formatDropBox = createFormatDropdown(id + "formats", formats);
    		
    		var formatDropBoxDiv = document.createElement("div"); 
    		
    		formatDropBoxDiv.appendChild(formatDropBox);
    		    		
    		templateProperties.formats = formatDropBoxDiv.innerHTML;
    		
    		template = TEMPLATE_EXECUTE_COMPLEX_OUTPUTS_MARKUP;
    		
    	}else if(output.literalOutput){
    		
    		template = TEMPLATE_EXECUTE_LITERAL_OUTPUTS_MARKUP;
    	
    	}else if(output.boundingBoxOutput){
    		
    		template = TEMPLATE_EXECUTE_BBOX_OUTPUTS_MARKUP;    	
    	}
    	
    	jQuery.tmpl(template, templateProperties).appendTo(outputsUl);
	}
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

function getComplexInputTextarea(id, number){
  return document.getElementById(id + number + "-input-textarea");
}

function getLiteralInputField(id, number){
  return document.getElementById(id + number);
}

function createComplexData(id, number){

	if(!number){
		number = "";
	}

    var textarea = getComplexInputTextarea(id, number);
    
    var value = textarea.value;
    
    if(!value || (value == "")){
    	return;
    } 			
    
    //if complex data get the selected value (serialized format object)
    //add schema, mimeType, encoding if existing
    var select = document.getElementById(id + number + "formats");   
    var selectedFormat = JSON.parse(select.options[select.selectedIndex].value);
    var mimeType = selectedFormat.mimeType;	
    var encoding = selectedFormat.encoding;	
    var schema = selectedFormat.schema;
    
    var checkBox = document.getElementById(id + number + "-checkbox");
    
    //check whether reference
    var reference = checkBox.checked;
    
    var complexData;        			
    
    if(reference){
    
        complexData = {
    		identifier : id,
			reference : {
    			mimeType: mimeType,
    			encoding: encoding,
    			schema: schema,
    			href: value,
    			method: "GET"
    		}
    	};   
    	
    }else{        			
    	complexData = {
    		identifier : id,
    		data: {
    			complexData: {
    				mimeType: mimeType,
    				encoding: encoding,
    				schema: schema,
    				value: value
    			}
    		}
    	};        			
    }
    
    return complexData;
}

function createLiteralData(id, number){

	if(!number){
		number = "";
	}
	
    var inputField = getLiteralInputField(id, number);
    var value;        			
    if(inputField.options){
    	//assume select
    	value = inputField.options[inputField.selectedIndex].value;
    }else{
    	value = inputField.value;
    }
    
    if(!value || (value == "")){
    	return;
    }

	var literalData = {
    	identifier : id,
    	data: {
    		literalData: {
    			value: value
    		}
    	}
    };
    
    return literalData;
}

function createBBoxData(id, number){

	if(!number){
		number = "";
	}
	
    var inputField = getLiteralInputField(id, number);
    var value;        			
    if(inputField.options){
    	//assume select
    	value = inputField.options[inputField.selectedIndex].value;
    }else{
    	value = inputField.value;
    }
    
    if(!value || (value == "")){
    	return;
    }

	var dimensions = value.split(",").length / 2;

	var boundingBoxData = {
    	identifier : id,
    	data: {
    		boundingBoxData: {
    				dimensions : dimensions,
    				projection : "EPSG:4326",//TODO get from processdescription, if available
       				bounds: OpenLayers.Bounds.fromString(value)
    		}
    	}
    };
    
    return boundingBoxData;
}


function stringStartsWith(target, sub) {
	return target.indexOf(sub) == 0;
}

// execute the process
// use OpenLayers functionality to build the execute request
// send it off and handle the response with our own functionality 
function execute(formId) {
    var formValues = jQuery('#'+formId).serializeArray();
    
    var inputs = new FormParser().parseInputs(formValues);
    
    var finalInputs = [];
    
    var input;
    // remove occurrences that the user has not filled out
    for (var i=process.dataInputs.length-1; i>=0; --i) {
        input = process.dataInputs[i];
        
        var id = input.identifier;
        
        if(input.occurrence > 1){
        	//get multiple inputs
        	for(var j = 1; j <= input.occurrence; j++){
        		if(input.complexData){
 	
 					var complexData = createComplexData(id, j);
 					
        			if(complexData){
        				finalInputs.push(complexData);
        			}
        		}else if(input.literalData){
					
					var literalData = createLiteralData(id, j);
					
					if(literalData){
        				finalInputs.push(literalData);
        			}					
        		}else if(input.boundingBoxData){
					
					var boundingBoxData = createBBoxData(id, j);
					
					if(boundingBoxData){
        				finalInputs.push(boundingBoxData);
        			}					
        		}           		
        	}
        }else{
        	if(input.complexData){
        		
        		var complexData;
        		
        		if(input.maxOccurs > 1){
        			//input has number 1 attached   			
        			complexData = createComplexData(id, "1");
 				}else{
 					complexData = createComplexData(id);
 				}
        		if(complexData){
        			finalInputs.push(complexData);
        		}
        			
        	}else if(input.literalData){
        		
        		var literalData;
        		
        		if(input.maxOccurs > 1){				
					literalData = createLiteralData(id, "1");
				}else{
					literalData = createLiteralData(id);
				}
				if(literalData){
        			finalInputs.push(literalData);
        		}
        	}else if(input.boundingBoxData){
        		
        		var boundingBoxData;
        		
        		if(input.maxOccurs > 1){				
					boundingBoxData = createBBoxData(id, "1");
				}else{
					boundingBoxData = createBBoxData(id);
				}
				if(boundingBoxData){
        			finalInputs.push(boundingBoxData);
        		}
        	}
        }
    }
    
    //make real copy as inputs of process are overwritten but the 
    //original inputs (i.e. all inputs) are needed for 
    //consecutive execution
    var finalProcess = JSON.parse(JSON.stringify(process));
    
    finalProcess.dataInputs = finalInputs;
    
    var outputs = process.processOutputs;
    
    var checkedOutputs = [];
    
    for(var i = 0; i < outputs.length; i++){
    	
    	var output = outputs[i];
    	
    	var identifier = output.identifier;
    	
    	//every output has a checkbox with id "output-id-checkbox"
    	//we need to get this here and see if it is checked    	
    	var checkbox = document.getElementById(identifier + "-checkbox");
    	
    	if(checkbox.checked){
    		var outputDef = {};
    		if(output.literalOutput){
    			 outputDef = {
					identifier:	identifier		
    			};
    		}else{    	
    			//if complex output get the selected value (serialized format object)
    			//add schema, mimeType, encoding if existing
    			var select = document.getElementById(identifier + "formats");   
    			var selectedFormat = JSON.parse(select.options[select.selectedIndex].value);
    			var mimeType = selectedFormat.mimeType;	
    			var encoding = selectedFormat.encoding;	
    			var schema = selectedFormat.schema;
    			
    			//TODO make this optional, i.e. make it possible to receive raw data?
    			outputDef.asReference = true;
    			outputDef.identifier = identifier;
    			outputDef.mimeType = mimeType;
    			if(encoding){
    				outputDef.encoding = encoding;    				
    			}
    			if(schema){
    				outputDef.schema = schema;    				
    			}
    			
    			
    		}
    		checkedOutputs.push(outputDef);
    		
    	}
    	
    }
    
    finalProcess.responseForm = {
        responseDocument: {
        	storeExecuteResponse: true,
        	outputs: checkedOutputs
        }
    };
    
    var settings = {
			url: wps,
			method: "post",
			domElement: jQuery('#executeProcess'),
			data: new OpenLayers.Format.WPSExecute().write(finalProcess),
			requestType: "Execute",
	};

	var originalRequest = new PostRequest(settings);

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

