
var FormParser = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	parseInputs : function(formValues) {
		var inputs = [];
		var inputNameToPosition = [];
		
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "input_")) {
				var j = inputs.length;
				inputs[j] = {};
				inputs[j].identifier = prop.name.substring(6, prop.name.length);
				inputs[j].value = prop.value;
				inputNameToPosition[prop.name] = j;
			}
		}
		
		/*
		 * look for each input's type
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "type_input")) {
				var originalInputName = prop.name.substring(5, prop.name.length);
				inputs[inputNameToPosition[originalInputName]].type = prop.value;
				
				if (stringStartsWith(prop.value, "complex")) {
					inputs[inputNameToPosition[originalInputName]].complexPayload = inputs[inputNameToPosition[originalInputName]].value;
				}
				
				else if (stringStartsWith(prop.value, "bbox")) {
					this.parseBboxValue(inputs[inputNameToPosition[originalInputName]].value, inputs[inputNameToPosition[originalInputName]]);
				}
			}
		}
		
		/*
		 * check asReference flag
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "checkbox_input")) {
				var originalInputName = prop.name.substring(9, prop.name.length);
				/*
				 * its only present in the array if checked
				 */
				inputs[inputNameToPosition[originalInputName]].aReference = true;
			}
		}
		
		/*
		 * look for each input's format
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "format_input")) {
				var originalInputName = prop.name.substring(7, prop.name.length);
				var formatObject = JSON.parse(prop.value);
				this.parseFormatObject(formatObject, inputs[inputNameToPosition[originalInputName]]);
			}
		}
		
		return inputs;
	},
	
	parseBboxValue : function(bboxString, targetObject) {
		var array = bboxString.split(",");

		if (array.length < 4) {
			for (var i = array.length; i < 4; i++) {
				/*
				 * bad input, fill it with zero
				 * TODO: do validation in prior
				 */
				array[i] = "0.0";
			}
		}
		
		targetObject.lowerCorner = jQuery.trim(array[0]) + " " + jQuery.trim(array[1]);
		targetObject.upperCorner = jQuery.trim(array[2]) + " " + jQuery.trim(array[3]);
	},
	
	parseOutputs : function(formValues) {
		var outputs = [];
		var outputNameToPosition = [];
		
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "output_")) {
				var j = outputs.length;
				outputs[j] = {};
				outputs[j].identifier = prop.name.substring(7, prop.name.length);

				//TODO: currently not supported in the form
				outputs[j].asReference = false;
				outputNameToPosition[prop.name] = j;
			}
		}
		
		/*
		 * look for each outputs type
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "type_output")) {
				var originalName = prop.name.substring(5, prop.name.length);
				outputs[outputNameToPosition[originalName]].type = prop.value;
			}
		}
		
		/*
		 * look for each outputs format
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "format_output")) {
				var originalName = prop.name.substring(7, prop.name.length);
				var formatObject = JSON.parse(prop.value);
				this.parseFormatObject(formatObject, outputs[outputNameToPosition[originalName]]);
			}
		}
		
		return outputs;
	},
	
	parseFormatObject : function(formatObject, targetObject) {
		if (formatObject.mimeType) {
			targetObject.mimeType = formatObject.mimeType;
		}
		
		if (formatObject.schema) {
			targetObject.schema = formatObject.schema;
		}
		
		if (formatObject.encoding) {
			targetObject.encoding = formatObject.encoding;
		}
	},
	
	parseProcessIdentifier : function(formValues) {
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (equalsString(prop.name, "processIdentifier")) {
				return prop.value;
			}
		}
		return "";
	},
	
	parseOutputStyle : function(formValues) {
		return {
			   storeExecuteResponse: true,
			   lineage: false,
			   status: true
		   };
	}

});
