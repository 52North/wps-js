/**
 * 
 */
var ExecuteRequest_v2 = ExecuteRequest
		.extend({

			/**
			 * will adjust the templates stored in ExecuteRequest.js file to
			 * reflect the WPS 2.0 request POST body
			 */
			overrideTemplates : function() {

				/*
				 * TODO ${responseForm} might be changed in WPS 2.0! check that!
				 */
				EXECUTE_REQUEST_XML_START = '<wps:Execute service="WPS" version="2.0.0" \
			xmlns:wps="http://www.opengis.net/wps/2.0" \
			xmlns:ows="http://www.opengis.net/ows/2.0" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
			xsi:schemaLocation="http://www.opengis.net/wps/2.0 \
			  http://schemas.opengis.net/wps/2.0/wpsExecute.xsd" \
			response="${responseFormat}" mode="${executionMode}"> \
			  <ows:Identifier>${processIdentifier}</ows:Identifier>\
				${dataInputs}\
			  ${responseForm}\
			</wps:Execute>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_ALL_INPUT = '<wps:Input id="${identifier}">\
			      <wps:Data schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
					${complexPayload}\
			      </wps:Data>\
			</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_MIME_TYPE_INPUT = '<wps:Input id="${identifier}">\
		      <wps:Data mimeType="${mimeType}">\
				${complexPayload}\
			  </wps:Data>\
			</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_SCHEMA_INPUT = '<wps:Input id="${identifier}">\
		      <wps:Data schema="${schema}" mimeType="${mimeType}">\
				${complexPayload}\
			  </wps:Data>\
			</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_ENCODING_INPUT = '<wps:Input id="${identifier}">\
		      <wps:Data mimeType="${mimeType}" encoding="${encoding}">\
				${complexPayload}\
			  </wps:Data>\
			</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ALL_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Reference schema="${schema}" mimeType="${mimeType}" encoding="${encoding}" \
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_SCHEMA_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Reference schema="${schema}" mimeType="${mimeType}" \
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ENCODING_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Reference mimeType="${mimeType}" encoding="${encoding}" \
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Reference mimeType="${mimeType}" xlink:href="${complexPayload}"/>\
		  </wps:Input>';
				/*
				 * These are the CORRECT values, currently the 52N WPS is
				 * implemented wrongly wrt literalValue
				 * 
				 */
				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_TYPE = '<wps:Input id="${identifier}">\
		    <wps:Data>\
				<wps:LiteralValue dataType="${dataType}">${value}</wps:LiteralValue>\
			</wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL = '<wps:Input id="${identifier}">\
		    <wps:Data>\
				<wps:LiteralValue dataType="${dataType}" uom="${uom}">${value}</wps:LiteralValue>\
			</wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Data>\
				<wps:LiteralValue>${value}</wps:LiteralValue>\
			</wps:Data>\
		  </wps:Input>';

				/*
				 * The follwing 3 are NOT CORRECT, but work currently with the
				 * 52°North WPS 2.0, which contains a false implmenetation wrt
				 * literalValues
				 */
/*
				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_TYPE = '<wps:Input id="${identifier}">\
				    <wps:Data>\
						${value}\
					</wps:Data>\
				  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL = '<wps:Input id="${identifier}">\
				    <wps:Data>\
						${value}\
					</wps:Data>\
				  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT = '<wps:Input id="${identifier}">\
				    <wps:Data>\
						${value}\
					</wps:Data>\
				  </wps:Input>';
*/
				EXECUTE_REQUEST_XML_BOUNDING_BOX_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Data>\
		       <ows:BoundingBox crs="${crs}" dimensions="${dimension}">\
		          <ows:LowerCorner>${lowerCorner}</ows:LowerCorner>\
		          <ows:UpperCorner>${upperCorner}</ows:UpperCorner>\
		       </ows:BoundingBox>\
		    </wps:Data>\
		 </wps:Input>';

				/*
				 * for WPS 2.0 there is no wrapping element around the outputs!
				 */
				EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT = '${outputs}';

				EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT = '<wps:Output id="${identifier}" \
			transmission="${transmission}" schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_OUTPUT = '<wps:Output id="${identifier}"\
					transmission="${transmission}">\
				      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT = '<wps:Output id="${identifier}" \
			transmission="${transmission}" mimeType="${mimeType}">\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_SCHEMA_OUTPUT = '<wps:Output id="${identifier}" \
			transmission="${transmission}" schema="${schema}" mimeType="${mimeType}">\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT = '<wps:Output id="${identifier}" \
			transmission="${transmission}" mimeType="${mimeType}" encoding="${encoding}">\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_LITERAL_OUTPUT = '<wps:Output id="${identifier}" transmission="${transmission}">\
		  </wps:Output>';

				/*
				 * raw output
				 * 
				 * in WPS 2.0 there is no special wrapping element for raw
				 * outputs, hence we just use the already specified output
				 * templates
				 * 
				 * also in WPS 2.0 there is no specification of UOM anymore. so
				 * simply ignore uom.
				 */
				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_ALL = EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT;

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_ENCODING_UOM = EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT;

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_UOM = EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT;

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE = EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT;

			},

			/**
			 * used to analyze the given request parameters and, if needed, add
			 * additional parameters to properly instantiate the templates.
			 */
			addVersionDependentProperties : function() {

				if (!this.settings.executionMode)
					this.settings.executionMode = "async";

				if (!this.settings.responseFormat)
					this.settings.responseFormat = "document";

				/*
				 * needed object to properly instantiate the outputs
				 * (responseForm template)
				 */
				this.settings.outputStyle = new Object();

			},

			/**
			 * add certain parameters, if necessary, to the given object
			 */
			addVersionDependentPropertiesToFinalExecuteProperties : function(
					finalExecuteProperties) {
				/*
				 * override in child classes
				 */

				finalExecuteProperties.responseFormat = this.settings.responseFormat;
				finalExecuteProperties.executionMode = this.settings.executionMode;

				return finalExecuteProperties;
			},

		});