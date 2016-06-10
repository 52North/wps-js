/*
 * Override existing variables to match WPS 1.0 documents
 */
var DescribeProcessResponse_v1_xml = DescribeProcessResponse_xml.extend({

	/*
	 * possibly, some methods have to be overridden, to parse WPS 1.0 documents
	 */
	
	resetParameterVariables : function(){
		PROCESS_OFFERING_VERSION = "1.0.0";

		PROCESS_OFFERING_XML_TAG_NAME = "ProcessDescription";

		FORMAT_MIME_TYPE_ATTR_NAME = "MimeType";
		FORMAT_ENCODING_ATTR_NAME = "Encoding";
		FORMAT_SCHEMA_ATTR_NAME = "Schema";
		
		LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME = "UOM";

		SUPPORTED_CRS_TAG_NAME = "SupportedCRS";
		
		LITERAL_DATA_OUTPUT_TAG_NAME = "LiteralOutput";
		COMPLEX_DATA_OUTPUT_TAG_NAME = "ComplexOutput";
		BBOX_DATA_OUTPUT_TAG_NAME = "BoundingBoxOutput";
	},
	
	createJobControlOptions : function(processOfferingXml){

		/*
		 * TODO for WPS 1.0 this attribut does not exist!
		 * But we have the attributes "storeSupported" 
		 * if true, then async-execution and stored as reference!
		 * 
		 * if false, then only sync-execution and return in document is possible.
		 */
		var storeSupported = processOfferingXml.attr("storeSupported");
		if (storeSupported)
			return "sync-execute async-execute";
		
		else		
			return "sync-execute";;
	},
	
	createOutputTransmission : function(processOfferingXml){

		/*
		 * TODO for WPS 1.0 this attribut does not exist!
		 * But we have the attributes "storeSupported" 
		 * if true, then async-execution and stored as reference!
		 * 
		 * if false, then only sync-execution and return in document is possible.
		 */
		var storeSupported = processOfferingXml.attr("storeSupported");
		if (storeSupported)
			return "value reference";
		
		else		
			return "value";
	},
	
	/**
	 * in WPS 1.0 is encoded as Tag
	 */
	extractMimeType : function(formatXml){
		return formatXml.find(FORMAT_MIME_TYPE_ATTR_NAME).text();
	},
	
	/**
	 * in WPS 1.0 is encoded as Tag
	 */
	extractEncoding : function(formatXml){
		return formatXml.find(FORMAT_ENCODING_ATTR_NAME).text() || undefined;
	},
	
	/**
	 * in WPS 1.0 is encoded as Tag
	 */
	extractSchema : function(formatXml){
		return formatXml.find(FORMAT_SCHEMA_ATTR_NAME).text() || undefined;
	},
	
	/**
	 * extracts the unit of measure.
	 * 
	 * in WPS 1.0 it is a bit tricky. WPS 1.0 defines a single LiteralData object which has a single UOMs object,
	 * which is split up into a single Default and a single Supported node. Standard contains a single UOM, 
	 * whereas Supported defines a list of supported UOMs... 
	 * 
	 * However, this conceptually differs from WPS 2.0 where there is a completely new node named LiteralDataDomain,
	 * which may occur multiple times! Each LiteralDataDomain object contains only ONE UOM node. 
	 * 
	 * This API returns documents closely modeled to the WPS 2.0 standard. Hence, we need one UOM per LiteralDatDomain.
	 * Thus, we just use the Default UOM of WPS 1.0 and loose all others.
	 */
	extractUnitOfMeasure : function(literalDataXml){
		return literalDataXml.find("UOMs").find("Default").find(LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME).text() || undefined;
	},
	
	extractFormatNodes : function(xmlNode){
		/*
		 * in WPS 1.0 formats are split up in a Supported and a Default subtag.
		 * To not have them listed twice, we just extract all Format Nodes from 
		 * the Supported subtag.
		 */
		return xmlNode.find("Supported").find(FORMAT_TAG_NAME);
	},
	
	createAllLiteralDataDomainObjects : function(literalDataXml){
		/*
		 * here, in WPS 1.0, we have no subTag called LiteralDataDomain 
		 * (which in WPS 2.0 may occur multiple times!).
		 * 
		 * In WPS 1.0 the difference is, that there are multiple UOMs.
		 * However, since this API encodes the description closely to 
		 * the WPS 2.0 standard, we only take the default UOM from WPS 1.0!
		 * 
		 * Hence, we just create on single object which holds the information.
		 * The remaining UOMs are lost! 
		 */
		var literalDataDomainArray = new Array(1);
		
		literalDataDomainArray[0] = this.createLiteralDataDomainObject($(literalDataXml));
		
		return literalDataDomainArray;
	}
	
});