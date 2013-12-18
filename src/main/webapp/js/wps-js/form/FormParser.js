
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
				inputs[inputNameToPosition[originalInputName]].schema = prop.value;
			}
		}
		
		return inputs;
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
		 * look for each input's type
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "type_output")) {
				var originalName = prop.name.substring(5, prop.name.length);
				outputs[outputNameToPosition[originalName]].type = prop.value;
			}
		}
		
		/*
		 * look for each input's format
		 */
		for (var i = 0; i < formValues.length; i++) {
			var prop = formValues[i];
			if (stringStartsWith(prop.name, "format_output")) {
				var originalName = prop.name.substring(7, prop.name.length);
				outputs[outputNameToPosition[originalName]].schema = prop.value;
			}
		}
		
		return outputs;
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
