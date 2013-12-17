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

var EXPECTED_RESULT_COMPLEX = '<wps:Execute service="WPS" version="1.0.0" \
	xmlns:wps="http://www.opengis.net/wps/1.0.0" \
	xmlns:ows="http://www.opengis.net/ows/1.1" \
	xmlns:xlink="http://www.w3.org/1999/xlink" \
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
	xsi:schemaLocation="http://www.opengis.net/wps/1.0.0    http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd" >\
	<ows:Identifier>org.n52.wps.server.WhateverYouWannaDo2</ows:Identifier>\
	<wps:DataInputs>\
   <wps:Input>\
      <ows:Identifier>myComplexInput1</ows:Identifier>\
      <wps:Data>\
         <wps:ComplexData \
	schema="text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd">\
	<heavy><xml><markup/></xml></heavy>\
	</wps:ComplexData>\
      </wps:Data>\
   </wps:Input>\
	</wps:DataInputs>\
	<wps:ResponseForm>\
   <wps:ResponseDocument storeExecuteResponse="true" lineage="true" status="true">\
      <wps:Output asReference="false" \
	schema="text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd" \
	mimeType="text/xml" encoding="UTF-8">\
         <ows:Identifier>myComplexOutput1</ows:Identifier>\
      </wps:Output>\
   </wps:ResponseDocument>\
	</wps:ResponseForm>\
	</wps:Execute>';

var EXPECTED_RESULT_BBOX = '<wps:Execute service="WPS" version="1.0.0" \
	xmlns:wps="http://www.opengis.net/wps/1.0.0" \
	xmlns:ows="http://www.opengis.net/ows/1.1" \
	xmlns:xlink="http://www.w3.org/1999/xlink" \
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
	xsi:schemaLocation="http://www.opengis.net/wps/1.0.0    \
	http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">\
	 	  <ows:Identifier>org.n52.wps.server.WhateverYouWannaDoWithBBOXes</ows:Identifier>\
		  <wps:DataInputs>\
			<wps:Input>\
		    <ows:Identifier>myBboxInput1</ows:Identifier>\
		    <wps:Data>\
			    <wps:BoundingBoxData ows:crs="THE:CRS" ows:dimensions="2">\
			       <ows:LowerCorner>52.0 7.1</ows:LowerCorner>\
			       <ows:UpperCorner>53.2 8.5</ows:UpperCorner>\
			    </wps:BoundingBoxData>\
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
		var executeRequest = new ExecuteRequest(createSettingsLiteral());
		
		var expectedXml = new DOMParser().parseFromString(EXPECTED_RESULT, "text/xml");
		var resultXml = new DOMParser().parseFromString(executeRequest.prepareHTTPRequest().data, "text/xml");
		
		jstestdriver.console.log("Expected XML: "+ new XMLSerializer().serializeToString(expectedXml));
		jstestdriver.console.log("Resulting XML: "+ new XMLSerializer().serializeToString(resultXml));
		
		assertTrue('Execute request markup not as expected.', compareXmlDeep(expectedXml,
				resultXml));
	},
	
	testExpectedRequestMarkupComplex : function() {
		var executeRequest = new ExecuteRequest(createSettingsComplex());
		
		var expectedXml = new DOMParser().parseFromString(EXPECTED_RESULT_COMPLEX, "text/xml");
		var resultXml = new DOMParser().parseFromString(executeRequest.prepareHTTPRequest().data, "text/xml");
		
		jstestdriver.console.log("Expected XML: "+ new XMLSerializer().serializeToString(expectedXml));
		jstestdriver.console.log("Resulting XML: "+ new XMLSerializer().serializeToString(resultXml));
		
		assertTrue('Execute request markup not as expected.', compareXmlDeep(expectedXml,
				resultXml));
	},
	
	testExpectedRequestMarkupBBOX : function() {
		var executeRequest = new ExecuteRequest(createSettingsBBOX());
		
		var expectedXml = new DOMParser().parseFromString(EXPECTED_RESULT_BBOX, "text/xml");
		var resultXml = new DOMParser().parseFromString(executeRequest.prepareHTTPRequest().data, "text/xml");
		
		jstestdriver.console.log("Expected XML: "+ new XMLSerializer().serializeToString(expectedXml));
		jstestdriver.console.log("Resulting XML: "+ new XMLSerializer().serializeToString(resultXml));
		
		assertTrue('Execute request markup not as expected.', compareXmlDeep(expectedXml,
				resultXml));
	}
	

});


function createSettingsLiteral() {
	var result = {
			   inputs: [
				      {
				    	  identifier: "myLiteralInput1",
				    	  type: "literal",
				    	  value:"myInput2Value",
				    	  dataType: "xs:string"
				      }
				   ],
				outputs:[
					  {
						  identifier: "myLiteralOutput1",
						  type: "literal"
					  }
				   ],
				   outputStyle: {
					   storeExecuteResponse: false,
					   lineage: false,
					   status: false
				   },
				processIdentifier: "org.n52.wps.server.WhateverYouWannaDo"
				};
	return result;
}

function createSettingsComplex() {
	var result = {
			   inputs: [
				      {
				    	  identifier: "myComplexInput1",
				    	  type: "complex",
				    	  value:"input-value",
				    	  asReference:false,
				    	  schema:"text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd",
				    	  complexPayload: "<heavy><xml><markup/></xml></heavy>"
				      }
				   ],
				outputs:[
					  {
						  identifier: "myComplexOutput1",
						  type: "complex",
						  asReference:false,
						  schema:"text/xml; http://schemas.opengis.net/gml/3.1.1/base/gml.xsd"
					  }
				   ],
				   outputStyle: {
					   storeExecuteResponse: true,
					   lineage: true,
					   status: true
				   },
				processIdentifier: "org.n52.wps.server.WhateverYouWannaDo2"
				};
	return result;
}

function createSettingsBBOX() {
	var result = {
			   inputs: [
				      {
				    	  identifier: "myBboxInput1",
				    	  type: "bbox",
				    	  crs:"THE:CRS",
				    	  dimension: 2,
				    	  lowerCorner: "52.0 7.1",
				    	  upperCorner: "53.2 8.5"
				      }
				   ],
				outputs:[
					  {
						  identifier: "myLiteralOutput1",
						  type: "literal"
					  }
				   ],
				   outputStyle: {
					   storeExecuteResponse: false,
					   lineage: false,
					   status: false
				   },
				processIdentifier: "org.n52.wps.server.WhateverYouWannaDoWithBBOXes"
				};
	return result;
}

function compareXmlDeep(xmlA, xmlB) {
	var xmlA = new Document();
	var xmlB = new Document();
	
	if (xmlA.nodeType != xmlB.nodeType) {
		jstestdriver.console.log("nodeType: "+ xmlA.nodeType +" != "+ xmlB.nodeType);
		return false;
	}
	
	//element node
	if (xmlA.nodeType == 1) {
		if (!equalsString(xmlA.nodeName, xmlB.nodeName)) {
			jstestdriver.console.log("elementNode: "+ xmlA.nodeName +" != "+ xmlB.nodeName);
			return false;
		}
	}
	//attribute node
	else if (xmlA.nodeType == 2) {
		if (!equalsString(xmlA.nodeValue, xmlB.nodeValue)) {
			jstestdriver.console.log("attributeNode: "+ xmlA.nodeValue +" != "+ xmlB.nodeValue);
			return false;
		}
	}
	//text node
	else if (xmlA.nodeType == 3) {
		if (!equalsString(xmlA.nodeValue, xmlB.nodeValue)) {
			jstestdriver.console.log("textNode: "+ xmlA.nodeValue +" != "+ xmlB.nodeValue);
			return false;
		}
	}
	
	if (xmlA.childNodes.length != xmlB.childNodes.length) {
		jstestdriver.console.log("childNodes length: "+ xmlA.nodeName +" != "+ xmlB.nodeName);
		logChildNodes(xmlA.childNodes);
		logChildNodes(xmlB.childNodes);
		return false;
	}
	
	for (var i = 0; i < xmlA.childNodes.length; i++) {
		/*
		 * TODO: 1. for complex elements ONLY consider non-text nodes
		 * 2. for mixed ignore empty text nodes
		 * 3. for simple elements compare contents
		 * 
		 * The behavior is kind of unstable without the above implemented
		 */
		if (!compareXmlDeep(xmlA.childNodes[i], xmlB.childNodes[i])) {
			return false;
		}
	}
	
	return true;
}

function logChildNodes(childNodes) {
	jstestdriver.console.log("logChildNodes...");
	for (var i = 0; i < childNodes.length; i++) {
		jstestdriver.console.log("name: "+ childNodes[i].nodeName);
	}
}
