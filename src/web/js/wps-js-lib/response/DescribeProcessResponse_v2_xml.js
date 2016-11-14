var DescribeProcessResponse_v2_xml = DescribeProcessResponse_xml.extend({

	/*
	 * override any method whose implementation differs for various WPS version!
	 */
	
	resetParameterVariables : function(){
		/*
		 * Override existing variables
		 */
		PROCESS_OFFERING_VERSION = "2.0.0";
		
		PROCESS_OFFERING_XML_TAG_NAME = "wps\\:ProcessOffering, ProcessOffering";

		JOB_CONTROL_OPTIONS_ATTR_NAME = "jobControlOptions";
		JOB_CONTROL_OPTIONS_ATTR_NAME_WITH_NS = "wps\\:jobControlOptions";

		OUTPUT_TRANSMISSION_ATTR_NAME = "outputTransmission";
		OUTPUT_TRANSMISSION_ATTR_NAME_WITH_NS = "wps\\:outputTransmission";
		
		FORMAT_MIME_TYPE_ATTR_NAME = "mimeType";
		FORMAT_ENCODING_ATTR_NAME = "encoding";
		FORMAT_SCHEMA_ATTR_NAME = "schema";
		
		LITERAL_DATA_DOMAIN_TAG_NAME = "wps\\:LiteralDataDomain, LiteralDataDomain";
		LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME = "ows\\:UOM, UOM";
		
		LITERAL_DATA_OUTPUT_TAG_NAME = "wps\\:LiteralData, ns\\:LiteralData, LiteralData";
		COMPLEX_DATA_OUTPUT_TAG_NAME = "wps\\:ComplexData, ns\\:ComplexData, ComplexData";
		BBOX_DATA_OUTPUT_TAG_NAME = "wps\\:BoundingBoxData, ns\\:BoundingBoxData, BoundingBoxData";
		
		CRS_TAG_NAME = "ows\\:SupportedCRS, wps\\:SupportedCRS, SupportedCRS";
	},
	
	createJobControlOptions : function(processOfferingXml){

		var jobControlOptionsString = processOfferingXml.attr(JOB_CONTROL_OPTIONS_ATTR_NAME) || processOfferingXml.attr(JOB_CONTROL_OPTIONS_ATTR_NAME_WITH_NS);
		
		/*
		 * the string holds job control options separated by whitespace
		 */
		
		return jobControlOptionsString.split(" ");
	},
	
	createOutputTransmissionModes : function(processOfferingXml){

		var outputTransmissionString = processOfferingXml.attr(OUTPUT_TRANSMISSION_ATTR_NAME) || processOfferingXml.attr(OUTPUT_TRANSMISSION_ATTR_NAME_WITH_NS);
		
		/*
		 * the string holds transmission modes separated by whitespace
		 */
		
		return outputTransmissionString.split(" ");
	},
	
	/**
	 * in WPS 2.0 is encoded as attribute
	 */
	extractMimeType : function(formatXml){
		return formatXml.attr(FORMAT_MIME_TYPE_ATTR_NAME);
	},
	
	/**
	 * in WPS 2.0 is encoded as attribute
	 */
	extractEncoding : function(formatXml){
		return formatXml.attr(FORMAT_ENCODING_ATTR_NAME) || undefined;
	},
	
	/**
	 * in WPS 2.0 is encoded as attribute
	 */
	extractSchema : function(formatXml){
		return formatXml.attr(FORMAT_SCHEMA_ATTR_NAME) || undefined;
	},
	
	/**
	 * create all literal data domain object.
	 * in WPS 2.0 a new Tag called "LiteralDataDomain"
	 * is introduced which may occur multiple times!
	 */
	createAllLiteralDataDomainObjects : function(literalDataXml){

		var literalDataDomain_xmlNodes = literalDataXml.find(LITERAL_DATA_DOMAIN_TAG_NAME);
		
		var literalDataDomainArray = new Array(literalDataDomain_xmlNodes.length);
		
		for(var index = 0; index < literalDataDomain_xmlNodes.length; index++){
			literalDataDomainArray[index] = this.createLiteralDataDomainObject($(literalDataDomain_xmlNodes[index]));
		}
		
		return literalDataDomainArray;
	},
	
	/**
	 * extracts the unit of measure.
	 */
	extractUnitOfMeasure : function(literalDataXml){
		return literalDataXml.find(LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME).text() || undefined;
	},
	
	extractFormatNodes : function(xmlNode){
		/*
		 * simply use all occurrences
		 */
		return xmlNode.find(FORMAT_TAG_NAME);
	}
	
});
