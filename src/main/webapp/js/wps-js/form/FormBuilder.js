
var TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP = '\
	<div class="wps-execute-complex-inputs" id="input_${identifier}"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list"> \
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
	<div class="wps-execute-literal-inputs" id="input_${identifier}"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}{{html copyButton}}</li> \
			</ul> \
		</div> \
	</div>';
	
var TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}${required}</label>{{html inputField}}</li>';


var TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP = '\
	<div class="wps-execute-bbox-inputs" id="input_${identifier}"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list"> \
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
					<label class="wps-input-item-label">${identifier}</label>{{html settings}}{{html asReference}}</li> \
				<li class="wps-execute-response-list-entry"> \
					{{html formats}}</li>';


var TEMPLATE_EXECUTE_LITERAL_OUTPUTS_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}</label>{{html settings}}{{html asReference}}</li>';

var TEMPLATE_EXECUTE_BBOX_OUTPUTS_MARKUP = '\
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-input-item-label">${identifier}</label>{{html settings}}{{html asReference}}</li>';

//array for storing literalvalues, used to obtain the defaultvalues that are defined by the server for this input
var literalInputsWithServerSideDefaultValues = [];

//array for storing literalvalues, used to obtain the defaultvalues that are defined by the client for this input
var clientSideDefaultValues = {"org.n52.wps.server.algorithm.SimpleBufferAlgorithm" : ["data", "http://geoprocessing.demo.52north.org:8080/geoserver/wfs?SERVICE=WFS&amp;VERSION=1.0.0&amp;REQUEST=GetFeature&amp;TYPENAME=topp:tasmania_roads&amp;SRS=EPSG:4326&amp;OUTPUTFORMAT=GML3"]};

var FormBuilder = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	clearForm : function(targetDiv) {
		targetDiv.html('');
	},
	
	buildExecuteForm : function(targetDiv, processDescription, executeCallback) {
	 	var formElement = jQuery('<form id="wps-execute-form"></form>');
	 	formElement.submit(function() {
	 			executeCallback("wps-execute-form");
	        	return false;
	        });
	 	if(processDescription["abstract"] != null && processDescription["abstract"] != "null") {
	 		formElement.append(jQuery('<span id="abstract">' + processDescription["abstract"] + "</span>"));
	 	}
	 	formElement.append(this.createFormInputs(processDescription.dataInputs));
        
        if(literalInputsWithServerSideDefaultValues.length > 0){
        
            var button = jQuery('<button type="button" id="fillServerSideDefaultValues-button">Fill in default values for LiteralData inputs defined by the WPS process</button>');
            formElement.append(button);
	        	
	        $('#wps-execute-container').on('click', '#fillServerSideDefaultValues-button', function () {
	        	       
	           for (var i=0; i < literalInputsWithServerSideDefaultValues.length; i++) {
	               var inputIDArray = literalInputsWithServerSideDefaultValues[i];	           
	               
	               var input = $('input[name='+ inputIDArray[0] + ']');
	               
	               if(input){
	                   input.val(inputIDArray[1]);
	               }
	               
	               var select = $('select[name='+ inputIDArray[0] + ']');
	               
	               if(select){
	                   select.val(inputIDArray[1]);
	               }	           
	           } 
	            
		    });
		}
		
        var clientSideDefaultValuesForProcess = clientSideDefaultValues[processDescription.identifier];
        
        if(clientSideDefaultValuesForProcess && clientSideDefaultValuesForProcess.length > 0){
        
            formElement.append(jQuery("<br>"));
        
            var button = jQuery('<button type="button" id="fillClientSideDefaultValues-button">Fill in default values defined by this client</button>');
            formElement.append(button);
	        	
	        $('#wps-execute-container').on('click', '#fillClientSideDefaultValues-button', function () {
	        	       
	           for (var i=0; i < clientSideDefaultValuesForProcess.length; i++) {
	               var inputIDArray = clientSideDefaultValuesForProcess[i];	           
	               
	               var textarea = $('textarea[name=input_'+ inputIDArray[0] + ']');
	               
	               if(input){
	                   textarea.val(inputIDArray[1]);
	               }	     
	           } 
	            
		    });
		}
        
		formElement.append(this.createFormOutputs(processDescription));
	 	formElement.append(jQuery('<input type="hidden" name="processIdentifier" value="'+processDescription.identifier+'" />'));
	        
        var executeButton = jQuery("<button id=\"btn_execute\">Execute</button>");
        formElement.append(executeButton);
        
        targetDiv.append(jQuery("<div>").append(formElement));
	},
	
	createFormInputs : function(inputs){
	    
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
	        	this.createInput(input, complexContainer, TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP, TEMPLATE_EXECUTE_COMPLEX_INPUTS_COPY_MARKUP, "complex-inputs", this.createComplexInput);       	   
	        } else if (input.boundingBoxData) {            
	        	this.createInput(input, bboxContainer, TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP, TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP, "bbox-inputs", this.createBoundingBoxInput);               
	        } else if (input.literalData) {
	        	this.createInput(input, literalContainer, TEMPLATE_EXECUTE_LITERAL_INPUTS_MARKUP, TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP, "literal-inputs", this.createLiteralInput);
	        }
	    }
	    
	    return container;	
	},

	createInput : function(input, container, template, copyTemplate, inputParentId, propertyCreationFunction){

	    var templateProperties = propertyCreationFunction(input, this);
	    
	    if (input.minOccurs > 0) {
	        templateProperties.required = "*";
	    }
	    	
	    var name = input.identifier;
	    
	    var button = null;
	    if (input.maxOccurs > 1) {
	    
	    	var copyButtonDiv = jQuery("<div></div>"); 
	    
	    	button = this.addInputCopyButton(name);    	
	    
			copyButtonDiv.append(button);
			templateProperties.copyButton = copyButtonDiv.html();
	    }
	    
	    var result = jQuery.tmpl(template, templateProperties);
	    result.appendTo(container);
	              
	    if (input.maxOccurs > 1) {
	    
	    	if (button) {
	    	
	    	$('#wps-execute-container').on('click', '#' + name + '-copy-button', function () { 
	    			var templateProperties = FormBuilder.prototype.createCopy(input, container, template, copyTemplate, inputParentId, propertyCreationFunction);
	    		
	    			if (templateProperties) {				
	    				var inputsUl = jQuery('#'+inputParentId);
	    				jQuery.tmpl(copyTemplate, templateProperties).appendTo(inputsUl);
	    			}
			});
	    	}
		
		}
	    
	    if (input.hidden) {
	    	result.css("display", "none");
	    }

	},

	// helper function for xml input
	createComplexInput : function(input, self) {
	    
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
	    	fieldName = "input_"+ name + "_"+ number;
	    }else {
	    	fieldName = "input_"+ name;
	    }
	    
	    field.attr("name", fieldName);
		inputType = FormBuilder.prototype.createInputTypeElement("complex", fieldName);
	    
	    field.attr("title", input["abstract"]);
	    
	    if (input.predefinedValue) {
	    	field.html(input.predefinedValue);
	    }
	    
	    fieldDiv.append(field);
	    fieldDiv.append(inputType);
	    
	    var labelText = "";
	    
	    if(input.maxOccurs > 1){
	    	labelText = input.identifier + "(" + number + "/" + input.maxOccurs + ")";
	    }else{
	    	labelText = input.identifier;
	    }
	        
	    var formats = input.complexData.supported.formats;
	    var formatDropBox = FormBuilder.prototype.createFormatDropdown("format_"+fieldName, formats, input); 
	    
	    var formatDropBoxDiv = jQuery("<div />"); 
	      
	    formatDropBoxDiv.append(formatDropBox);
	      
	    var checkBoxDiv = jQuery('<div />'); 
	    
	    var checkBox = jQuery('<input type="checkbox" name="checkbox_'+fieldName + '" value="asReference" title="This input is a reference to the actual input."/>');
	    
	    checkBoxDiv.append(checkBox);
	    checkBoxDiv.append("asReference");
	    
	    complexInputElements.identifier = labelText;
	    complexInputElements.inputField = fieldDiv.html();
	    complexInputElements.asReference = checkBoxDiv.html();
	    complexInputElements.formats = formatDropBoxDiv.html();
	    
	    return complexInputElements;    
	},

	// helper function to create a literal input textfield or dropdown
	createLiteralInput : function(input, self) {
	    
	    var literalInputElements = {};        
	    
	    var fieldDiv = jQuery("<div />"); 
	    
	    var labelText = "";
	    
	    var number = "";
	    
	    if(input.maxOccurs > 1){
	    	number = (input.occurrence || 1);
	    } 
	    
	    var name = input.identifier;
	    
	    var fieldName = "input_"+ name + number;
	    
	    if(input.literalData.defaultValue){
	        literalInputsWithServerSideDefaultValues.push([fieldName, input.literalData.defaultValue]);
	    }
	    
	    var anyValue = input.literalData.anyValue;
	    // anyValue means textfield, otherwise we create a dropdown
	    var field = anyValue ? jQuery("<input />") : jQuery("<select />");    
	    
	    field.attr("name", fieldName);
	    field.attr("id", fieldName);
	    var inputType = FormBuilder.prototype.createInputTypeElement("literal", fieldName);

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
	            
	            if (input.predefinedValue && equalsString(input.predefinedValue, v)) {
	            	option.attr("selected", true);
	            }
	            
	            field.append(option);
	        }
	    
	   		if(input.literalData.defaultValue){
	   			field.attr("value", input.literalData.defaultValue); 
	   		}
	    }
	    
	    if (input.predefinedValue) {
	    	if (anyValue) {
	    		field.attr("value", input.predefinedValue);
	    	}
	    }
	    
	    literalInputElements.identifier = labelText;
	    literalInputElements.inputField = fieldDiv.html();
	    
	    return literalInputElements; 
	},

	// helper function to dynamically create a bounding box input
	createBoundingBoxInput : function(input, self) {
	    
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
	    var inputType = FormBuilder.prototype.createInputTypeElement("bbox", fieldName);

	    field.attr("title", input["abstract"]);
	    
	    if (input.predefinedValue) {
	    	field.attr("value", input.predefinedValue);
	    }
	    
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
	},

	createInputTypeElement : function(theType, theId) {
		var typeInput = jQuery('<input type="hidden" value="'+theType+'" name="type_'+theId+ '" />');
		
		return typeInput;
	},
	
	createFormatDrowpdownEntry : function(format) {
		
		//if these exist, append with semicolon, else return empty string
    	var schema = format.schema;
    	var encoding = format.encoding;
    	var mimeType = format.mimeType;
    	
    	var formatString = FormBuilder.prototype.createFormatString(mimeType, schema, encoding);
    	
    	return formatString;
	},
	
	createFormatString : function(mimeType, schema, encoding) {
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
    	
    	return formatString;
	},

	createFormOutputs : function(processDescription){
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
	    	
	    	var outputSettingsDiv = jQuery("<div />");
	    	
	    	var checkBox = jQuery('<input type="checkbox"/>');
	    	checkBox.attr("name", id);
	    	checkBox.attr("title", "Enable this output.");
	    	
	    	var typeField = this.createInputTypeElement(output.complexOutput ? "complex" : "literal", id);
	    	
	    	if (output.selected) {
	    		checkBox.attr("checked", "checked");
	    	}
	    	
	    	outputSettingsDiv.append(checkBox);
	    	outputSettingsDiv.append("request this output");
	    	outputSettingsDiv.append(typeField);
	    		    
	        var checkBox = jQuery('<input type="checkbox" name="checkbox_'+id + '" value="asReference" title="This ouput will be requested as reference."/>');
	        
	        outputSettingsDiv.append(checkBox);
	        outputSettingsDiv.append("asReference");
	        
	    	templateProperties.identifier = id;
	    	templateProperties.settings = outputSettingsDiv.html();
	    	
	    	if (output.complexOutput) {
	    		var formats = output.complexOutput.supported.formats;
	    		var defaultFormat = output.complexOutput["default"].formats[0];
	    		
	    		var formatDropBox = this.createFormatDropdown("format_"+id, formats, output);
	    		
	    		// set the default as selected in the dropdown
	    		formatDropBox.val(JSON.stringify(defaultFormat));
	    		
	    		var formatDropBoxDiv = jQuery("<div />");
	    		
	    		formatDropBoxDiv.append(formatDropBox);
	    		    		
	    		// FIXME this looses the selection again!
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
	},

	createFormatDropdown : function(id, formats, input){

	    // anyValue means textfield, otherwise we create a dropdown
	    var field = jQuery('<select name="'+id+'" title="'+input["abstract"]+'"/>');
	    
	    var option;
	    for (var i = 0; i < formats.length; i++) {
	    	var format = formats[i];
	    	
	    	var formatString = this.createFormatDrowpdownEntry(format);

	    	option = jQuery('<option>'+formatString+'</option>');
	        option.val(JSON.stringify(format));
	        field.append(option);
	    }
		return field;
	},

	addInputCopyButton : function(id){
		var button = jQuery('<button type="button" class="add-input-copy" id="'+id+'-copy-button" />');
		return button;
	},

	// if maxOccurs is > 1, this will add a copy of the field
	createCopy : function(input, container, template, copyTemplate, inputParentId, propertyCreationFunction) {
	    if (input.maxOccurs && input.maxOccurs > 1) {
	        // add another copy of the field - check maxOccurs
	        if(input.occurrence && input.occurrence >= input.maxOccurs){
	        	return;
	        }
	        var newInput = jQuery.extend({}, input);
	        // we recognize copies by the occurrence property
	        input.occurrence = (input.occurrence || 1) + 1;
	        newInput.occurrence = input.occurrence;
	        return FormBuilder.prototype.createInput(newInput, container, template, copyTemplate, inputParentId, propertyCreationFunction);
	    }
	}
	
});
