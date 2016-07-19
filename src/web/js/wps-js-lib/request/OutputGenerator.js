/**
 * Helper class to construct output objects for execute requests against WPS 1.0
 * and 2.0
 */
var OutputGenerator = Class.extend({
	/**
	 * 
	 */
	init : function(settings) {
		this.settings = settings;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @asReference boolean, "true" or "false"
	 */
	createComplexOutput_WPS_1_0 : function(identifier, mimeType, schema,
			encoding, uom, asReference, title, abstractValue) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType,
			schema : schema,
			encoding : encoding,
			uom : uom,
			asReference : asReference,
			title : title,
			abstractValue : abstractValue
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @asReference boolean, "true" or "false"
	 */
	createLiteralOutput_WPS_1_0 : function(identifier) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @transmission either "value" or "reference"
	 */
	createComplexOutput_WPS_2_0 : function(identifier, mimeType, schema,
			encoding, transmission) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType,
			schema : schema,
			encoding : encoding,
			transmission : transmission,
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @transmission either "value" or "reference"
	 */
	createLiteralOutput_WPS_2_0 : function(identifier, transmission) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
			transmission : transmission,
		});

		return output;
	}

});