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
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}{{html copyButton}}</li> \
			</ul> \
		</div> \
	</div>';

var TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}</li>';

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
		$('#'+originalRequest.updateSwitch.element).css( 'cursor', 'pointer' );
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
                option = document.createElement("option");
                option.innerHTML = offerings[p].identifier;
                option.value = p;
                dropdown.appendChild(option);				
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
    document.getElementById("input").innerHTML = "<h3>Inputs:</h3>";
    
    document.getElementById("output").innerHTML = "";

 	var supported = true;
 	
 	getInputs();
    
    var outputH3 = document.createElement("h3");
    
    outputH3.innerHTML = "Outputs:"; 
    
    document.getElementById("input").appendChild(outputH3);
    
    //TODO also check whether supported outputs?
    getOutputs();
        
    document.getElementById("input").appendChild(document.createElement("p"));
    
    if (supported) {
        var executeButton = document.createElement("button");
        executeButton.innerHTML = "Execute";
        document.getElementById("input").appendChild(executeButton);
        executeButton.onclick = execute;
    } else {
        document.getElementById("input").innerHTML = '<span class="notsupported">' +
            "Sorry, this client does not support the selected process." +
            "</span>";
    }
}

function getInputs(){
    
    var inputElements = [];
    var container = document.getElementById("input");
    var inputs = process.dataInputs,       
        input;
    for (var i=0,ii=inputs.length; i<ii; ++i) {
        input = inputs[i];    
                
        if (input.complexData) {    		    		
			getInput(input, container, TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP, TEMPLATE_EXECUTE_COMPLEX_INPUTS_COPY_MARKUP, "complex-inputs", getComplexInput);       	   
        } else if (input.boundingBoxData) {            
            getInput(input, container, TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP, TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP, "bbox-inputs", getBoundingBoxInput);               
        } else if (input.literalData) {
            getInput(input, container, TEMPLATE_EXECUTE_LITERAL_INPUTS_MARKUP, TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP, "literal-inputs", getLiteralInput);
        }
    }
    
    return inputElements;	
}

function getInput(input, container, template, copyTemplate, inputParentId, fn){

    var templateProperties = fn(input);
    
    if (input.minOccurs > 0) {
        templateProperties.required = "*";
    }
    	
    var name = input.identifier;
    
    if(input.maxOccurs > 1){
    
    	var copyButtonDiv = document.createElement("div"); 
    
    	var button = addInputCopyButton(name);    	
    
		copyButtonDiv.appendChild(button);
		templateProperties.copyButton = copyButtonDiv.innerHTML;
    }
    
    $.tmpl(template, templateProperties).appendTo(container);
              
    if(input.maxOccurs > 1){
    
    	var button = document.getElementById(name + "-copy-button");
    
    	button.onclick = function(){ 
			var templateProperties = createCopy(input, fn);
		
			if(templateProperties){				
				var inputsUl = document.getElementById(inputParentId);
	
				$.tmpl(copyTemplate, templateProperties).appendTo(inputsUl);
			}
		};
	
	}

}

// helper function for xml input
function getComplexInput(input) {
    
    var complexInputElements = {};
    
    var name = input.identifier;        
    
    var fieldDiv = document.createElement("div"); 
    
    var field = document.createElement("textarea");
    field.className = "wps-complex-input-textarea";
    field.title = input["abstract"];
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 
    
    if(input.maxOccurs > 1){
    	field.id = name + number + "-input-textarea";
    }else {
    	field.id = name + "-input-textarea";    
    }
    field.title = input["abstract"];
    
    fieldDiv.appendChild(field);
    
    var labelText = "";
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText = input.identifier;
    }
        
    var formats = input.complexData.supported.formats;
    var formatDropBox = createFormatDropBox(name + number + "formats", formats); 
    
    var formatDropBoxDiv = document.createElement("div"); 
      
    formatDropBoxDiv.appendChild(formatDropBox);
      
    var checkBoxDiv = document.createElement("div");   
    
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = name + number + "-checkbox";
    checkBox.value = "asReference";
    
    checkBoxDiv.appendChild(checkBox);
    
    checkBoxDiv.appendChild(document.createTextNode("asReference"));
    
    complexInputElements.identifier = labelText;
    complexInputElements.inputField = fieldDiv.innerHTML;
    complexInputElements.asReference = checkBoxDiv.innerHTML;
    complexInputElements.formats = formatDropBoxDiv.innerHTML;
    
    return complexInputElements;    
}

// helper function to create a literal input textfield or dropdown
function getLiteralInput(input) {
    
    var literalInputElements = {};        
    
    var fieldDiv = document.createElement("div"); 
    
    var labelText = "";
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 
    
    var name = input.identifier;
    var anyValue = input.literalData.anyValue;
    // anyValue means textfield, otherwise we create a dropdown
    var field = document.createElement(anyValue ? "input" : "select");    
    
    field.id = name + number;

    field.title = input["abstract"];
    
    fieldDiv.appendChild(field);
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText = input.identifier;
    }
    
    if (anyValue) {
        var dataType = input.literalData.dataType;
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
    }
    
    literalInputElements.identifier = labelText;
    literalInputElements.inputField = fieldDiv.innerHTML;   
    
    return literalInputElements; 
}

// helper function to dynamically create a bounding box input
function getBoundingBoxInput(input) {
    
    var bboxInputElements = {};        
    
    var fieldDiv = document.createElement("div"); 
    
    var labelText = "";
    
    var number = "";
    
    if(input.maxOccurs > 1){
    	number = (input.occurrence || 1);
    } 
    
    var name = input.identifier;
    var field = document.createElement("input");
    field.title = input["abstract"];

    field.id = name + number;

    field.title = input["abstract"];
    
    fieldDiv.appendChild(field);
    
    if(input.maxOccurs > 1){
    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
    }else{
    	labelText= input.identifier;
    }
    
    bboxInputElements.identifier = labelText;
    bboxInputElements.inputField = fieldDiv.innerHTML;   
	
	return bboxInputElements;
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
    		
    		var formatDropBox = createFormatDropBox(id + "formats", formats);
    		
    		container.appendChild(formatDropBox);
    		container.appendChild(document.createElement("p"));
    		
    	}
	}
}

function getOutputs(){
    
    var container = document.getElementById("input");
    
	$.tmpl(TEMPLATE_EXECUTE_OUTPUTS_MARKUP, "").appendTo(container);
	
	var outputsUl = document.getElementById("outputs");
	
	var outputs = process.processOutputs;
	
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
    		
    		var formatDropBox = createFormatDropBox(id + "formats", formats);
    		
    		var formatDropBoxDiv = document.createElement("div"); 
    		
    		formatDropBoxDiv.appendChild(formatDropBox);
    		    		
    		templateProperties.formats = formatDropBoxDiv.innerHTML;
    		
    		template = TEMPLATE_EXECUTE_COMPLEX_OUTPUTS_MARKUP;
    		
    	}else if(output.literalOutput){
    		
    		template = TEMPLATE_EXECUTE_LITERAL_OUTPUTS_MARKUP;
    	
    	}else if(output.boundingBoxOutput){
    		
    		template = TEMPLATE_EXECUTE_BBOX_OUTPUTS_MARKUP;    	
    	}
    	
    	$.tmpl(template, templateProperties).appendTo(outputsUl);
	}
}

function createFormatDropBox(id, formats){

    var container = document.getElementById("input");
    // anyValue means textfield, otherwise we create a dropdown
    var field = document.createElement("select");
    field.id = id;
    field.title = input["abstract"];
    
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
        option = document.createElement("option");
        option.value = JSON.stringify(format);
        option.innerHTML = formatString;
        field.appendChild(option);
    }
	return field;
}

function addInputCopyButton(id){

	var button = document.createElement("button");
	
	button.className = "add-input-copy";
	
	button.id = id + "-copy-button";
	
	return button;
}

// if maxOccurs is > 1, this will add a copy of the field
function createCopy(input, fn) {
    if (input.maxOccurs && input.maxOccurs > 1) {
        // add another copy of the field - check maxOccurs
        if(input.occurrence && input.occurrence >= input.maxOccurs){
        	return;
        }
        var newInput = OpenLayers.Util.extend({}, input);
        // we recognize copies by the occurrence property
        input.occurrence = (input.occurrence || 1) + 1;
        newInput.occurrence = input.occurrence;
        return fn(newInput);
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

	var boundingBoxData = {
    	identifier : id,
    	data: {
    		boundingBoxData: {
    				projection : "EPSG:4326",//TODO get from processdescription, if available
       				bounds: OpenLayers.Bounds.fromString(value)
    		}
    	}
    };
    
    return boundingBoxData;
}

// execute the process
// use OpenLayers functionality to build the execute request
// send it off and handle the response with our own functionality 
function execute() {
    
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
    var finalProcess = JSON.parse(JSON.stringify(process)) 
    
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
			domElement: $('#executeProcess'),
			data: new OpenLayers.Format.WPSExecute().write(finalProcess),
			requestType: "Execute",
	}

	var originalRequest = new PostRequest(settings);

	originalRequest.execute(callbackOnResponseParsed, {});
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
