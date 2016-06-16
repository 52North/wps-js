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
	 * the rest might be null!
	 * 
	 * @asReference boolean, "true" or "false"
	 */
	createOutput_WPS_1_0 : function(identifier, mimeType, schema, encoding,
			uom, asReference, title, abstractValue) {
		var output = new Object({
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
	 * the rest might be null!
	 * 
	 * @transmission either "value" or "reference"
	 */
	createOutput_WPS_2_0 : function(identifier, mimeType, schema, encoding,
			transmission) {
		var output = new Object({
			identifier : identifier,
			mimeType : mimeType,
			schema : schema,
			encoding : encoding,
			transmission : transmission,
		});

		return output;
	}

});