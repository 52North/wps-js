
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

var FormBuilder = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	clearForm : function(targetDiv) {
		targetDiv.html('');
	},
	
	buildExecuteForm : function(targetDiv, processDescription, executeCallback) {
		jQuery("#abstract").html(processDescription["abstract"]);

	 	var supported = true;
	 	
	 	var formElement = jQuery('<form id="wps-execute-form"></form>');
	 	formElement.submit(function() {
	 			executeCallback("wps-execute-form");
	        	return false;
	        });
	 	formElement.append(this.createFormInputs(processDescription.dataInputs));
		formElement.append(this.createFormOutputs(processDescription));
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
	        	this.createInput(input, container, TEMPLATE_EXECUTE_COMPLEX_INPUTS_MARKUP, TEMPLATE_EXECUTE_COMPLEX_INPUTS_COPY_MARKUP, "complex-inputs", this.createComplexInput);       	   
	        } else if (input.boundingBoxData) {            
	        	this.createInput(input, container, TEMPLATE_EXECUTE_BBOX_INPUTS_MARKUP, TEMPLATE_EXECUTE_BBOX_INPUTS_COPY_MARKUP, "bbox-inputs", this.createBoundingBoxInput);               
	        } else if (input.literalData) {
	        	this.createInput(input, container, TEMPLATE_EXECUTE_LITERAL_INPUTS_MARKUP, TEMPLATE_EXECUTE_LITERAL_INPUTS_COPY_MARKUP, "literal-inputs", this.createLiteralInput);
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
	    
	    jQuery.tmpl(template, templateProperties).appendTo(container);
	              
	    if (input.maxOccurs > 1) {
	    
	    	if (button) {
	    		button.onclick = function() { 
	    			var templateProperties = this.createCopy(input, propertyCreationFunction);
	    		
	    			if (templateProperties) {				
	    				var inputsUl = jQuery('#'+inputParentId);
	    				jQuery.tmpl(copyTemplate, templateProperties).appendTo(inputsUl);
	    			}
	    		};	
	    	}
		
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
	    	fieldName = "input_"+ name + number;
	    }else {
	    	fieldName = "input_"+ name;
	    }
	    
	    field.attr("name", fieldName);
		inputType = self.createInputTypeElement("complex", fieldName);
	    
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
	    var formatDropBox = self.createFormatDropdown("format_"+fieldName, formats, input); 
	    
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
	    var anyValue = input.literalData.anyValue;
	    // anyValue means textfield, otherwise we create a dropdown
	    var field = anyValue ? jQuery("<input />") : jQuery("<select />");    
	    
	    field.attr("name", fieldName);
	    var inputType = self.createInputTypeElement("literal", fieldName);

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
	    var inputType = self.createInputTypeElement("bbox", fieldName);

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
	},

	createInputTypeElement : function(theType, theId) {
		var typeInput = jQuery('<input type="hidden" value="'+theType+'" name="type_'+theId+ '" />');
		
		return typeInput;
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
	    	
	    	var checkBoxDiv = jQuery("<div />");
	    	
	    	var checkBox = jQuery('<input type="checkbox"/>');
	    	checkBox.attr("name", id);
	    	var typeField = this.createInputTypeElement(output.complexOutput ? "complex" : "literal", id);
	    	
	    	checkBoxDiv.append(checkBox);
	    	checkBoxDiv.append(typeField);
	    	
	    	templateProperties.identifier = id;
	    	templateProperties.shouldBeRequested = checkBoxDiv.html();
	    	
	    	if (output.complexOutput) {
	    		var formats = output.complexOutput.supported.formats;
	    		
	    		var formatDropBox = this.createFormatDropdown("format_"+id, formats, output);
	    		
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
	},

	createFormatDropdown : function(id, formats, input){

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
	},

	addInputCopyButton : function(id){
		var button = jQuery('<button class="add-input-copy" id="'+id+'-copy-button" />');
		return button;
	},

	// if maxOccurs is > 1, this will add a copy of the field
	createCopy : function(input, propertyCreationFunction) {
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
	
});
