/**
 * Helper class to construct input objects for execute requests against WPS 1.0
 * and 2.0
 */
var InputGenerator = Class
		.extend({
			/**
			 * 
			 */
			init : function(settings) {
				this.settings = settings;
			},

			/**
			 * the following parameters are mandatory: identifier and value
			 * 
			 * the rest might be set to 'undefined'!
			 */
			createLiteralDataInput_wps_1_0_and_2_0 : function(identifier, dataType,
					uom, value) {
				var input = new Object({
					type : "literal",
					identifier : identifier,
					dataType : dataType,
					uom : uom,
					value : value
				});

				return input;
			},

			/**
			 * the following parameters are mandatory: identifier and
			 * complexPayload
			 * 
			 * the rest might be set to 'undefined'!
			 * 
			 * @complexPayload the complex payload (XML tags) as String
			 * @asReference boolean, either "true" or "false", indicating
			 *              whether parameter body contains a URL as reference
			 *              to an external body or the actual POST body
			 */
			createComplexDataInput_wps_1_0_and_2_0 : function(identifier,
					mimeType, schema, encoding, asReference, complexPayload) {
				var input = new Object({
					type : "complex",
					identifier : identifier,
					mimeType : mimeType,
					schema : schema,
					encoding : encoding,
					asReference : asReference,
					complexPayload : complexPayload
				});

				return input;
			},

			/**
			 * the following parameters are mandatory: identifier, crs,
			 * lowerCorner and upperCorner
			 * 
			 * the rest might be set to 'undefined'!
			 * 
			 * @crs coordinate reference system URI
			 * @dimension number of dimensions in this CRS
			 * @lowerCorner orderedSequence of double values
			 * @upperCorner orderedSequence of double values
			 */
			createBboxDataInput_wps_1_0_and_2_0 : function(identifier, crs,
					dimension, lowerCorner, upperCorner) {
				var input = new Object({
					type : "bbox",
					identifier : identifier,
					crs : crs,
					dimension : dimension,
					lowerCorner : lowerCorner,
					upperCorner : upperCorner
				});

				return input;
			},

		});