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
	 * @identifier output identifier
	 * @mimeType MIME type of the input; may be 'undefined'
	 * @schema reference to a schema; may be 'undefined'
	 * @encoding encoding; may be 'undefined'
	 * @uom unit of measure; may be 'undefined'
	 * @asReference boolean, "true" or "false"
	 * @title new title
	 * @abstractValue new description as text of the 'Abstract' element
	 * 				  of the response document
	 */
	createComplexOutput_WPS_1_0 : function(identifier, mimeType, schema,
			encoding, uom, asReference, title, abstractValue) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType || undefined,
			schema : schema || undefined,
			encoding : encoding || undefined,
			uom : uom || undefined,
			asReference : asReference || false,
			title : title  || undefined,
			abstractValue : abstractValue || undefined
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * @identifier output identifier
	 * @asReference boolean, "true" or "false"
	 */
	createLiteralOutput_WPS_1_0 : function(identifier, asReference) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
			asReference : asReference || false
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier and transmission
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @identifier output identifier
	 * @mimeType MIME type of the input; may be 'undefined'
	 * @schema reference to a schema; may be 'undefined'
	 * @encoding encoding; may be 'undefined'
	 * @transmission either "value" or "reference"
	 */
	createComplexOutput_WPS_2_0 : function(identifier, mimeType, schema,
			encoding, transmission) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType || undefined,
			schema : schema || undefined,
			encoding : encoding || undefined,
			transmission : transmission  || "value"
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier and transmission
	 * 
	 * @identifier output identifier
	 * @transmission either "value" or "reference"
	 */
	createLiteralOutput_WPS_2_0 : function(identifier, transmission) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
			transmission : transmission  || "value"
		});

		return output;
	}

});