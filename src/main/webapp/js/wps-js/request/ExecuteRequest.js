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

var EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT = '<wps:Input>\
	      <ows:Identifier>${identifier}</ows:Identifier>\
	      <wps:Data>\
	        <wps:LiteralData dataType="${dataType}">${value}</wps:LiteralData>\
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

var EXECUTE_REQUEST_XML_COMPLEX_OUTPUT = '<wps:Output \
	asReference="${asReference}" schema="${schema}" mimeType="${mimeType}" encoding="${encoding}">\
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
			responseFormMarkup = this.createResponseFormMarkup(outputs);
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
		var markup;
		for (var i = 0; i < inputs.length; i++) {
			if ("literal".localeCompare(inputs[i].type) == 0) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT, inputs[i]);
				result += markup;
			}
			else {
				
			}
		}
		
		return result;
	},
	
	createResponseFormMarkup : function(outputs) {
		var outputString = "";
		for (var i = 0; i < outputs.length; i++) {
			if ("literal".localeCompare(outputs[i].type) == 0) {
				outputString += this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_OUTPUT, outputs[i]);
			}
			else {
				
			}
		}
		
		var templateProperties = {
				outputs: outputString,
				storeExecuteResponse: false,
				lineage: false,
				status: false
		};
		
		var result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT, templateProperties);
		
		return result;
	}
	
});
