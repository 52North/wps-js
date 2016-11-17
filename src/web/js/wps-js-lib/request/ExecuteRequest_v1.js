/**
 * 
 */
var ExecuteRequest_v1 = ExecuteRequest
		.extend({

			/**
			 * will adjust the templates stored in ExecuteRequest.js file to
			 * reflect the WPS 1.0 request POST body
			 */
			overrideTemplates : function() {
				EXECUTE_REQUEST_XML_START = '<wps:Execute service="WPS" version="1.0.0" \
			xmlns:wps="http://www.opengis.net/wps/1.0.0" \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
			xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 \
			  http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd"> \
			  <ows:Identifier>${processIdentifier}</ows:Identifier>\
			  <wps:DataInputs>\
				${dataInputs}\
		      </wps:DataInputs>\
			  ${responseForm}\
			</wps:Execute>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_ALL_INPUT = '<wps:Input>\
			      <ows:Identifier>${identifier}</ows:Identifier>\
			      <wps:Data>\
					<wps:ComplexData schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
					${complexPayload}\
					</wps:ComplexData>\
			      </wps:Data>\
			</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_MIME_TYPE_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
				<wps:ComplexData mimeType="${mimeType}">\
				${complexPayload}\
				</wps:ComplexData>\
		    </wps:Data>\
		</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_SCHEMA_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
				<wps:ComplexData schema="${schema}" mimeType="${mimeType}">\
				${complexPayload}\
				</wps:ComplexData>\
		    </wps:Data>\
		</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_ENCODING_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
				<wps:ComplexData mimeType="${mimeType}" encoding="${encoding}">\
				${complexPayload}\
				</wps:ComplexData>\
		    </wps:Data>\
		</wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ALL_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Reference schema="${schema}" mimeType="${mimeType}" encoding="${encoding}"\
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_SCHEMA_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Reference schema="${schema}" mimeType="${mimeType}"\
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ENCODING_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Reference encoding="${encoding}" mimeType="${mimeType}"\
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Reference mimeType="${mimeType}"\
			xlink:href="${complexPayload}"/>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_TYPE = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
		      <wps:LiteralData dataType="${dataType}">${value}</wps:LiteralData>\
		    </wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
		      <wps:LiteralData dataType="${dataType}" uom="${uom}">${value}</wps:LiteralData>\
		    </wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
		      <wps:LiteralData>${value}</wps:LiteralData>\
		    </wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_BOUNDING_BOX_INPUT = '<wps:Input>\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		    <wps:Data>\
		       <wps:BoundingBoxData ows:crs="${crs}" ows:dimensions="${dimension}">\
		          <ows:LowerCorner>${lowerCorner}</ows:LowerCorner>\
		          <ows:UpperCorner>${upperCorner}</ows:UpperCorner>\
		       </wps:BoundingBoxData>\
		    </wps:Data>\
		 </wps:Input>';

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_ALL = '<wps:ResponseForm>\
			    <wps:RawDataOutput mimeType="${mimeType}" schema="${schema}" encoding="${encoding}" \
					uom="${uom}">\
			      <ows:Identifier>${identifier}</ows:Identifier>\
			    </wps:RawDataOutput>\
			  </wps:ResponseForm>';

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_ENCODING_UOM = '<wps:ResponseForm>\
		    <wps:RawDataOutput mimeType="${mimeType}" encoding="${encoding}"\
				uom="${uom}">\
		      <ows:Identifier>${identifier}</ows:Identifier>\
		    </wps:RawDataOutput>\
		  </wps:ResponseForm>';

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_UOM = '<wps:ResponseForm>\
		    <wps:RawDataOutput mimeType="${mimeType}" \
				uom="${uom}">\
		      <ows:Identifier>${identifier}</ows:Identifier>\
		    </wps:RawDataOutput>\
		  </wps:ResponseForm>';

				EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE = '<wps:ResponseForm>\
		    <wps:RawDataOutput mimeType="${mimeType}">\
		      <ows:Identifier>${identifier}</ows:Identifier>\
		    </wps:RawDataOutput>\
		  </wps:ResponseForm>';

				EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT = '<wps:ResponseForm>\
		    <wps:ResponseDocument storeExecuteResponse="${storeExecuteResponse}" \
			lineage="${lineage}" status="${status}">\
			${outputs}\
		    </wps:ResponseDocument>\
		  </wps:ResponseForm>';

				EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT = '<wps:Output \
			asReference="${asReference}" schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
		        <ows:Identifier>${identifier}</ows:Identifier>\
		      </wps:Output>';
				
				EXECUTE_REQUEST_XML_COMPLEX_OUTPUT = '<wps:Output \
					asReference="${asReference}">\
				        <ows:Identifier>${identifier}</ows:Identifier>\
				      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT = '<wps:Output \
			asReference="${asReference}" mimeType="${mimeType}">\
		        <ows:Identifier>${identifier}</ows:Identifier>\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_SCHEMA_OUTPUT = '<wps:Output \
			asReference="${asReference}" schema="${schema}" mimeType="${mimeType}">\
		        <ows:Identifier>${identifier}</ows:Identifier>\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT = '<wps:Output \
			asReference="${asReference}" mimeType="${mimeType}" encoding="${encoding}">\
		        <ows:Identifier>${identifier}</ows:Identifier>\
		      </wps:Output>';

				EXECUTE_REQUEST_XML_LITERAL_OUTPUT = '<wps:Output asReference="${asReference}">\
		    <ows:Identifier>${identifier}</ows:Identifier>\
		  </wps:Output>';
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
				 * add an explicit outputStyle object
				 */

				this.settings.outputStyle = new Object();
				if (this.settings.executionMode == "async") {
					/*
					 * if execution mode is set to async, then we imply that
					 * response must be stored on the server and that there
					 * shall be status updates to enable status queries
					 */
					this.settings.storeExecuteResponse = true;
					this.settings.status = true;
				} else
					this.settings.storeExecuteResponse = false;

				this.settings.outputStyle.lineage = false;
				if (this.settings.lineage == true)
					this.settings.outputStyle.lineage = true;

				this.settings.outputStyle.storeExecuteResponse = false;
				if (this.settings.storeExecuteResponse == true)
					this.settings.outputStyle.storeExecuteResponse = true;

				this.settings.outputStyle.status = false;
				if (this.settings.status == true)
					this.settings.outputStyle.status = true;

			},

			/**
			 * add certain parameters, if necessary, to the given object
			 */
			addVersionDependentPropertiesToFinalExecuteProperties : function(
					finalExecuteProperties) {
				/*
				 * for WPS 1.0 we do not have to add anything!
				 */
				return finalExecuteProperties;
			}

		});