var EXECUTE_REQUEST_XML_START = '<wps:Execute service="WPS" version="1.0.0" \
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

var EXECUTE_REQUEST_XML_COMPLEX_DATA_ALL_INPUT = '<wps:Input>\
	      <ows:Identifier>${identifier}</ows:Identifier>\
	      <wps:Data>\
			<wps:ComplexData schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
			${complexPayload}\
			</wps:ComplexData>\
	      </wps:Data>\
	</wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_MIME_TYPE_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
		<wps:ComplexData mimeType="${mimeType}">\
		${complexPayload}\
		</wps:ComplexData>\
    </wps:Data>\
</wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_SCHEMA_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
		<wps:ComplexData schema="${schema}" mimeType="${mimeType}">\
		${complexPayload}\
		</wps:ComplexData>\
    </wps:Data>\
</wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_ENCODING_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
		<wps:ComplexData mimeType="${mimeType}" encoding="${encoding}">\
		${complexPayload}\
		</wps:ComplexData>\
    </wps:Data>\
</wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Reference schema="${schema}" mimeType="${mimeType}"\
	xlink:href="${complexPayload}"/>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
      <wps:LiteralData dataType="${dataType}">${value}</wps:LiteralData>\
    </wps:Data>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
      <wps:LiteralData>${value}</wps:LiteralData>\
    </wps:Data>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_BOUNDING_BOX_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
       <wps:BoundingBoxData ows:crs="${crs}" ows:dimensions="${dimension}">\
          <ows:LowerCorner>${lowerCorner}</ows:LowerCorner>\
          <ows:UpperCorner>${upperCorner}</ows:UpperCorner>\
       </wps:BoundingBoxData>\
    </wps:Data>\
 </wps:Input>';

var EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW = '<wps:ResponseForm>\
	    <wps:RawDataOutput mimeType="${mimeType}">\
	      <ows:Identifier>${identifier}</ows:Identifier>\
	    </wps:RawDataOutput>\
	  </wps:ResponseForm>';

var EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT = '<wps:ResponseForm>\
    <wps:ResponseDocument storeExecuteResponse="${storeExecuteResponse}" \
	lineage="${lineage}" status="${status}">\
	${outputs}\
    </wps:ResponseDocument>\
  </wps:ResponseForm>';

var EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT = '<wps:Output \
	asReference="${asReference}" schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
        <ows:Identifier>${identifier}</ows:Identifier>\
      </wps:Output>';

var EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT = '<wps:Output \
	asReference="${asReference}" mimeType="${mimeType}">\
        <ows:Identifier>${identifier}</ows:Identifier>\
      </wps:Output>';

var EXECUTE_REQUEST_XML_COMPLEX_SCHEMA_OUTPUT = '<wps:Output \
	asReference="${asReference}" schema="${schema}" mimeType="${mimeType}">\
        <ows:Identifier>${identifier}</ows:Identifier>\
      </wps:Output>';

var EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT = '<wps:Output \
	asReference="${asReference}" mimeType="${mimeType}" encoding="${encoding}">\
        <ows:Identifier>${identifier}</ows:Identifier>\
      </wps:Output>';
	
var EXECUTE_REQUEST_XML_LITERAL_OUTPUT = '<wps:Output>\
    <ows:Identifier>${identifier}</ows:Identifier>\
  </wps:Output>';

var ExecuteRequest = PostRequest.extend({

	createPostPayload : function() {
		var inputs = this.settings.inputs;
		var outputs = this.settings.outputs;
		
		var dataInputsMarkup = "";
		if (inputs) {
			dataInputsMarkup = this.createDataInputsMarkup(inputs);
		}
		
		var responseFormMarkup = "";
		if (outputs) {
			responseFormMarkup = this.createResponseFormMarkup(outputs, this.settings.outputStyle);
		}
		
		var templateProperties = {
				processIdentifier: this.settings.processIdentifier,
				dataInputs: dataInputsMarkup,
				responseForm: responseFormMarkup
		};
		
		var result = this.fillTemplate(EXECUTE_REQUEST_XML_START, templateProperties);
		
		return result;
	},
	
	createDataInputsMarkup : function(inputs) {
		var result = "";
		for (var i = 0; i < inputs.length; i++) {
			var markup = "";
			if (equalsString("literal", inputs[i].type)) {
				markup = this.createLiteralDataInput(inputs[i]);
			}
			else if (equalsString("complex", inputs[i].type)) {
				markup = this.createComplexDataInput(inputs[i]);
			}
			else if (equalsString("bbox", inputs[i].type)) {
				markup = this.createBoundingBoxDataInput(inputs[i]);
			}
			result += markup;
		}
		
		return result;
	},
	
	/*
	 * example 'input' objects:
	 * 
	 * {
	 * identifier: "theInputId",
	 * value: "10.0",
	 * dataType: "xs:double"
	 * }
	 * 
	 * {
	 * identifier: "theInputId",
	 * value: "myStringValue"
	 * }
	 * 
	 */
	createLiteralDataInput : function(input) {
		var markup;
		if (input.dataType) {
			markup = this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT, input);
		}
		else {
			markup = this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT, input);
		}
		
		return markup;
	},
	
	/*
	 * example 'input' objects:
	 * 
	 * {
	 * identifier: "theProcessId",
	 * schema: "http://schema.xsd.url",
	 * complexPayload: "<heavy><xml><markup/></xml></heavy>"
	 * }
	 * 
	 * {
	 * identifier: "theProcessId",
	 * schema: "http://schema.xsd.url",
	 * href: "http://the.online.resource",
	 * method: "GET"
	 * }
	 * 
	 */
	createComplexDataInput : function(input) {
		var markup;
		if (input.asReference) {
			markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT, input);
		}
		else {
			if (input.schema && input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_ALL_INPUT, input);
			}
			
			else if (input.schema && !input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_SCHEMA_INPUT, input);
			}
			
			else if (!input.schema && input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_ENCODING_INPUT, input);
			}
			
			else {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_MIME_TYPE_INPUT, input);
			}
		}
		
		return markup;
	},
	
	/*
	 * example 'input' objects:
	 * 
	 * {
	 * identifier: "theInputId",
	 * crs: "EPSG:4236",
	 * dimension: 2,
	 * lowerCorner: "-10.0 40.5",
	 * upperCorner: "20.4 65.3",
	 * }
	 * 
	 * {
	 * identifier: "theInputId",
	 * value: "myStringValue"
	 * }
	 * 
	 */
	createBoundingBoxDataInput : function(input) {
		/*
		 * set some default values
		 */
		if (!input.crs) {
			input.crs = "EPSG:4326";
		}
		
		if (!input.dimension) {
			input.dimension = 2;
		}
		
		var markup = this.fillTemplate(EXECUTE_REQUEST_XML_BOUNDING_BOX_INPUT, input);
		
		return markup;
	},
	
	/*
	 * example 'outputStyle' objects:
	 * 
	 * {
	 *     storeExecuteResponse: true,
	 *     lineage: false,
	 *     status: true
	 * }
	 * 
	 * example 'outputs' objects:
	 * 
	 * [
	 * 	  {
	 * 		  identifier: "myComplexOutput1",
	 * 		  type: "complex",
	 * 		  asReference:false,
	 * 		  mimeType: "text/xml",
	 * 		  schema:"http://schemas.opengis.net/gml/3.1.1/base/gml.xsd",
	 *        encoding: "UTF-8"
	 * 	  },
	 * 	  {
	 * 		  identifier: "myLiteralOutput1",
	 * 		  type: "literal"
	 * 	  }
	 * ]
	 * 
	 */
	createResponseFormMarkup : function(outputs, outputStyle) {
		var outputString = "";
		for (var i = 0; i < outputs.length; i++) {
			if (equalsString("literal", outputs[i].type)) {
				outputString += this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_OUTPUT, outputs[i]);
			}
			else {
				if (outputs[i].encoding && outputs[i].schema) {
					outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT, outputs[i]);
				}
				
				else if (outputs[i].encoding && !outputs[i].schema) {
					outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT, outputs[i]);
				}
				
				else if (!outputs[i].encoding && outputs[i].schema) {
					outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_SCHEMA_OUTPUT, outputs[i]);
				}
				
				else {
					outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT, outputs[i]);
				}
			}
		}
		
		outputStyle.outputs = outputString;
		
		var result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT, outputStyle);
		
		return result;
	}
	
});
