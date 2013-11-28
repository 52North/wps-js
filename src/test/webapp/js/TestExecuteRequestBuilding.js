var EXPECTED_RESULT = '<wps:Execute service="WPS" version="1.0.0" \
	xmlns:wps="http://www.opengis.net/wps/1.0.0" \
	xmlns:ows="http://www.opengis.net/ows/1.1" \
	xmlns:xlink="http://www.w3.org/1999/xlink" \
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
	xsi:schemaLocation="http://www.opengis.net/wps/1.0.0    \
	http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">\
	 	  <ows:Identifier>org.n52.wps.server.WhateverYouWannaDo</ows:Identifier>\
		  <wps:DataInputs>\
			<wps:Input>\
		      <ows:Identifier>myLiteralInput1</ows:Identifier>\
		      <wps:Data>\
		        <wps:LiteralData dataType="xs:string">myInput2Value</wps:LiteralData>\
		      </wps:Data>\
		    </wps:Input>\
	      </wps:DataInputs>\
		  <wps:ResponseForm>\
	    <wps:ResponseDocument storeExecuteResponse="false" lineage="false" status="false">\
		  <wps:Output>\
	       <ows:Identifier>myLiteralOutput1</ows:Identifier>\
    	  </wps:Output>\
	    </wps:ResponseDocument>\
	  </wps:ResponseForm>\
	</wps:Execute>';

TestCase('TestExecuteRequestBuilding', {

	testExpectedRequestMarkup : function() {
		var executeRequest = new ExecuteRequest(createSettings());
		
		var expectedXml = new DOMParser().parseFromString(EXPECTED_RESULT, "text/xml");
		var resultXml = new DOMParser().parseFromString(executeRequest.prepareHTTPRequest().data, "text/xml");
		
		jstestdriver.console.log("Expected XML: "+ new XMLSerializer().serializeToString(expectedXml));
		jstestdriver.console.log("Resulting XML: "+ new XMLSerializer().serializeToString(resultXml));
		
		assertTrue('Execute request markup not as expected.', compareXmlDeep(expectedXml,
				resultXml));
	},
	
	testShouldDefineTemplates: function() {
		jQuery.wpsSetup({
			templates : {
				capabilities : "capabilities",
				processDescription : "processDescription",
				executeResponse: "executeResponse"
			}
		});
		
		assertEquals('Capabilities template not as expected.', "capabilities",
				USER_TEMPLATE_CAPABILITIES_MARKUP);
		assertEquals('ProcessDescription template not as expected.', "processDescription",
				USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP);
		assertEquals('ExecuteResponse template not as expected.', "executeResponse",
				USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP);
		
		jQuery.wpsSetup({
			reset : true
		});
	}

});


function createSettings() {
	var result = {
			   inputs: [
				      {
				    	  identifier: "myComplexInput1",
				    	  type: "complex",
				    	  value:"input-value",
				    	  asReference:false,
				    	  schema:"text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd"
				      },
				      {
				    	  identifier: "myLiteralInput1",
				    	  type: "literal",
				    	  value:"myInput2Value",
				    	  dataType: "xs:string"
				      }
				   ],
				outputs:[
					  {
						  identifier: "myComplexOutput1",
						  type: "complex",
						  asReference:false,
						  schema:"text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd"
					  },
					  {
						  identifier: "myLiteralOutput1",
						  type: "literal"
					  }
				   ],
				processIdentifier: "org.n52.wps.server.WhateverYouWannaDo"
				};
	return result;
}

function compareXmlDeep(xmlA, xmlB) {
//	var xmlA = new Document();
//	var xmlB = new Document();
	
	if (xmlA.nodeType != xmlB.nodeType) {
		return false;
	}
	
	//element node
	if (xmlA.nodeType == 1) {
		if (!equalsString(xmlA.nodeName, xmlB.nodeName)) {
			return false;
		}
	}
	//attribute node
	else if (xmlA.nodeType == 2) {
		if (!equalsString(xmlA.nodeValue, xmlB.nodeValue)) {
			return false;
		}
	}
	//text node
	else if (xmlA.nodeType == 3) {
		if (!equalsString(xmlA.nodeValue, xmlB.nodeValue)) {
			return false;
		}
	}
	
	if (xmlA.childNodes.length != xmlB.childNodes.length) {
		return false;
	}
	
	for (var i = 0; i < xmlA.childNodes.length; i++) {
		if (!compareXmlDeep(xmlA.childNodes[i], xmlB.childNodes[i])) {
			return false;
		}
	}
	
	return true;
}

function equalsString(a, b) {
	return jQuery.trim(a).localeCompare(jQuery.trim(b)) == 0;
}