
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
			if (stringStartsWith(prop.name, "type_")) {
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
			if (stringStartsWith(prop.name, "checkbox_")) {
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
			if (stringStartsWith(prop.name, "format_")) {
				var originalInputName = prop.name.substring(7, prop.name.length);
				inputs[inputNameToPosition[originalInputName]].schema = prop.value;
			}
		}
		
		return inputs;
	}

});
