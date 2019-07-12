/*
 * definition of parameter names and values that will be used for 
 * generating the process description. Values will have standard values 
 * for WPS 2.0.
 * 
 * In subclasses, these values shall be overridden to alter the values!!!!
 */

var PROCESS_OFFERING_VERSION = "2.0.0";

var PROCESS_OFFERING_XML_TAG_NAME = "wps\\:ProcessOffering, ProcessOffering";

var PROCESS_VERSION_ATTR_NAME = "processVersion";
var PROCESS_VERSION_ATTR_NAME_WITH_NS = "wps\\:processVersion";

var JOB_CONTROL_OPTIONS_ATTR_NAME = "jobControlOptions";
var JOB_CONTROL_OPTIONS_ATTR_NAME_WITH_NS = "wps\\:jobControlOptions";

var OUTPUT_TRANSMISSION_ATTR_NAME = "outputTransmission";
var OUTPUT_TRANSMISSION_ATTR_NAME_WITH_NS = "wps\\:outputTransmission";

var PROCESS_TAG_NAME = "wps\\:Process, Process";
var TITLE_TAG_NAME = "ows\\:Title, Title";
var ABSTRACT_TAG_NAME = "ows\\:Abstract, Abstract";
var IDENTIFIER_TAG_NAME = "ows\\:Identifier, Identifier";

var PROCESS_INPUT_TAG_NAME = "wps\\:Input, Input";
var PROCESS_OUTPUT_TAG_NAME = "wps\\:Output, Output";

var LITERAL_DATA_TAG_NAME = "wps\\:LiteralData, ns\\:LiteralData, LiteralData";
var COMPLEX_DATA_TAG_NAME = "wps\\:ComplexData, ns\\:ComplexData, ComplexData";
var BBOX_DATA_TAG_NAME = "wps\\:BoundingBoxData, ns\\:BoundingBoxData, BoundingBoxData";

var LITERAL_DATA_OUTPUT_TAG_NAME = "wps\\:LiteralData, ns\\:LiteralData, LiteralData";
var COMPLEX_DATA_OUTPUT_TAG_NAME = "wps\\:ComplexData, ns\\:ComplexData, ComplexData";
var BBOX_DATA_OUTPUT_TAG_NAME = "wps\\:BoundingBoxData, ns\\:BoundingBoxData, BoundingBoxData";

var MIN_OCCURS_ATTR_NAME = "minOccurs";
var MIN_OCCURS_ATTR_NAME_WITH_NS = "wps\\:minOccurs";

var MAX_OCCURS_ATTR_NAME = "maxOccurs";
var MAX_OCCURS_ATTR_NAME_WITH_NS = "wps\\:maxOccurs";

var FORMAT_TAG_NAME = "ns\\:Format, wps\\:Format, Format";
var FORMAT_MIME_TYPE_ATTR_NAME = "mimeType";
var FORMAT_ENCODING_ATTR_NAME = "encoding";
var FORMAT_SCHEMA_ATTR_NAME = "schema";

var LITERAL_DATA_DOMAIN_TAG_NAME = "wps\\:LiteralDataDomain, LiteralDataDomain";
var LITERAL_DATA_ANY_VALUE_TAG_NAME = "ows\\:AnyValue, AnyValue";
var LITERAL_DATA_ALLOWED_VALUES_TAG_NAME = "ows\\:AllowedValues, AllowedValues";

var LITERAL_DATA_ALLOWED_VALUES_VALUE_TAG_NAME = "ows\\:Value, Value";
var LITERAL_DATA_ALLOWED_VALUES_RANGE_TAG_NAME = "ows\\:Range, Range";
var LITERAL_DATA_ALLOWED_VALUES_RANGE_MINIMUM_VALUE_TAG_NAME = "ows\\:MinimumValue, MinimumValue";
var LITERAL_DATA_ALLOWED_VALUES_RANGE_MAXIMUM_VALUE_TAG_NAME = "ows\\:MaximumValue, MaximumValue";

var LITERAL_DATA_DATA_TYPE_TAG_NAME = "ows\\:DataType, DataType";
var LITERAL_DATA_VALUES_REFERENCE_TAG_NAME = "ows\\:ValuesReference, ValuesReference";
var LITERAL_DATA_REFERENCE_ATTR_NAME = "reference";
var LITERAL_DATA_REFERENCE_ATTR_NAME_WITH_NS = "ows\\:reference";
var LITERAL_DATA_DEFAULT_VALUE_TAG_NAME = "ows\\:DefaultValue, DefaultValue";
var LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME = "ows\\:UOM, UOM";

//var SUPPORTED_CRS_TAG_NAME = "SupportedCRS";
var CRS_TAG_NAME = "ows\\:CRS, wps\\:CRS, CRS";


var DescribeProcessResponse_xml = DescribeProcessResponse.extend({
	
	instantiate : function(wpsResponse) {
		
		/*
		 * in child classes, this method may change certain values 
		 * of the above listed variables, that are used to extract 
		 * information out of the XML document
		 */
		this.resetParameterVariables();
		
		/*
		 * version
		 */
		this.processOffering.version = PROCESS_OFFERING_VERSION;
		
		var processOfferingXml = $(wpsResponse).find(PROCESS_OFFERING_XML_TAG_NAME);
		
		/*
		 processOfferingXml	 */
		this.processOffering.processVersion = processOfferingXml.attr(PROCESS_VERSION_ATTR_NAME) || processOfferingXml.attr(PROCESS_VERSION_ATTR_NAME_WITH_NS);
		this.processOffering.jobControlOptions = this.createJobControlOptions(processOfferingXml);
		this.processOffering.outputTransmissionModes = this.createOutputTransmissionModes(processOfferingXml);
		
		/*
		 * process
		 */
//		var processXml = processOfferingXml.find(PROCESS_TAG_NAME);
		/*
		 * .find(selector) will return more instances of title, abstract and identifier 
		 *  than just the ones for the process.
		 * 
		 *  Instead it will also include objects for each Input and Output.
		 *  
		 *  Hence we simply take the first returned objects, as those will be the process level.
		 */
		this.processOffering.process.title = $(processOfferingXml.find(TITLE_TAG_NAME)[0]).text();
		this.processOffering.process.abstractValue = $(processOfferingXml.find(ABSTRACT_TAG_NAME)[0]).text() || undefined;
		this.processOffering.process.identifier = $(processOfferingXml.find(IDENTIFIER_TAG_NAME)[0]).text();
		/*
		 * TODO how to deal with nested input and nested output??? 
		 * 
		 */
		this.processOffering.process.inputs = this.createInputs(processOfferingXml.find(PROCESS_INPUT_TAG_NAME));
		this.processOffering.process.outputs = this.createOutputs(processOfferingXml.find(PROCESS_OUTPUT_TAG_NAME));
		
	},
	
	/**
	 * in child classes this method should be overridden in order to reset parameter values
	 */
	resetParameterVariables : function(){
		/*
		 * here do noting
		 */
	},
	
	createJobControlOptions : function(processOfferingXml){
		/*
		 * must be overridden in child classes
		 * 
		 * it differs fpr various WPS version!
		 */
	},
	
	createOutputTransmissionModes : function(processOfferingXml){
		/*
		 * must be overridden in child classes
		 * 
		 * it differs for various WPS version!
		 */
	},
	
	createInputs : function(xmlNodes){
		var array = new Array(xmlNodes.length);
		
		for (var index = 0; index < xmlNodes.length; index++) {
			var inputXml = $(xmlNodes[index]);
			
			if(inputXml.find(LITERAL_DATA_TAG_NAME).length > 0)
				array[index] = this.createLiteralDataInputFromXml(inputXml);
			
			else if (inputXml.find(COMPLEX_DATA_TAG_NAME).length > 0)
				array[index] = this.createComplexDataInputFromXml(inputXml);
			
			else if (inputXml.find(BBOX_DATA_TAG_NAME).length > 0)
				array[index] = this.createBboxDataInputFromXml(inputXml);
			
			/*
			 * nested input!
			 */
			else if(inputXml.find(PROCESS_INPUT_TAG_NAME).length > 0)
				array[index] = this.createInputs(inputXml);
			
		}
		
		return array;
	},

	createLiteralDataInputFromXml : function(xmlNode) {
		var minOccurs = xmlNode.attr(MIN_OCCURS_ATTR_NAME) || xmlNode.attr(MIN_OCCURS_ATTR_NAME_WITH_NS);
		var maxOccurs = xmlNode.attr(MAX_OCCURS_ATTR_NAME) || xmlNode.attr(MAX_OCCURS_ATTR_NAME_WITH_NS);
		
		var title = xmlNode.find(TITLE_TAG_NAME).text();
		var abstractValue = xmlNode.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = xmlNode.find(IDENTIFIER_TAG_NAME).text();
		
		/*
		 * literal data input
		 */
		var formatNodes = this.extractFormatNodes(xmlNode);

		/*
		 * in WPS 1.0 there is no format for a literal input!
		 * 
		 * but in WPS 2.0 there is!
		 * 
		 * Hence, we just add an "|| undefined"
		 */
		var formatArray = this.createFormatArray(formatNodes) || undefined;
		
		
		var literalDataDomainArray = this.createLiteralDataDomainArray(xmlNode.find(LITERAL_DATA_TAG_NAME));
			
//		this.createLiteralDataDomainArray(xmlNode.find(LITERAL_DATA_DOMAIN_TAG_NAME));
	
		return this.createLiteralDataInput(title, abstractValue, identifier, minOccurs, 
				maxOccurs, formatArray, literalDataDomainArray);
	},
	
	/**
	 * extracts all Format nodes. Varies for different WPS version
	 */
	extractFormatNodes : function(xmlNode){
		/*
		 * override in child classes
		 */
	},
	
	createLiteralDataDomainArray : function(literalDataDomainXml){
		
		/*
		 * for various WPS version, this call produces different results!
		 */
		return this.createAllLiteralDataDomainObjects(literalDataDomainXml);
	},
	
	/**
	 * create all literal data domain object.
	 * for differnt WPS version, the number of allowed instances varies. In WPS 1.0 
	 * only one occurence is allowed, whereas in WPS 2.0 a new Tag called "LiteralDataDomain"
	 * is introduced which may occur multiple times!
	 * 
	 * Hence we override this method in child classes to provide the correct results!
	 */
	createAllLiteralDataDomainObjects : function(literalDataXml){
		/*
		 * override in child methods!
		 */
	},
	
	/**
	 * regardsles of the WPS version, this method should provide the expected results
	 * to instantiate an instance of literalDataObject!
	 */
	createLiteralDataDomainObject : function(literalDataDomain_xml){
	
		var literalDataDomainObject = new Object();
		
		/*
		 * on of the three tags for allowed value specification can occur:
		 * 
		 * 1: AnyValue 
		 * 
		 * 2: AllowedValues
		 * 
		 * 3: ValuesReference
		 */
		literalDataDomainObject.anyValue = false;
		
		if(literalDataDomain_xml.find(LITERAL_DATA_ANY_VALUE_TAG_NAME).length > 0)
			literalDataDomainObject.anyValue = true;
		
		else if(literalDataDomain_xml.find(LITERAL_DATA_ALLOWED_VALUES_TAG_NAME).length > 0)
			literalDataDomainObject.allowedValues = this.createAllowedValues(literalDataDomain_xml.find(LITERAL_DATA_ALLOWED_VALUES_TAG_NAME));
		
		else
			literalDataDomainObject.valuesReference = literalDataDomain_xml.find(LITERAL_DATA_VALUES_REFERENCE_TAG_NAME).text();
		
		var dataType_xml = literalDataDomain_xml.find(LITERAL_DATA_DATA_TYPE_TAG_NAME);
		
		var dataTypeObject = new Object();
		dataTypeObject.type = dataType_xml.text()  || undefined;
		dataTypeObject.reference = dataType_xml.attr(LITERAL_DATA_REFERENCE_ATTR_NAME) || dataType_xml.attr(LITERAL_DATA_REFERENCE_ATTR_NAME_WITH_NS);
		
		literalDataDomainObject.dataType = dataTypeObject;
		
		literalDataDomainObject.defaultValue = literalDataDomain_xml.find(LITERAL_DATA_DEFAULT_VALUE_TAG_NAME).text() || undefined;
		/*
		 * uom = unit of measure
		 * 
		 * TODO create new extraction method that is overridden in child classes
		 */
		literalDataDomainObject.unitOfMeasure = this.extractUnitOfMeasure(literalDataDomain_xml);
		
		return literalDataDomainObject;
	},
	
	/**
	 * extracts the unit of measure.
	 * 
	 * Differs for different WPS versions
	 */
	extractUnitOfMeasure : function(literalDataXml){
		/*
		 * override in child classes!
		 */
	},
	
	createAllowedValues : function(allowedValues_xml){

		/*
		 * if allowedValues_xml actually exists:
		 * 
		 * allowedValues_xml might either be an array of "Value"-tags or 
		 * 
		 * have a child node called "Range".
		 */
		var object = new Object();
				
			var values_xml = allowedValues_xml.find(LITERAL_DATA_ALLOWED_VALUES_VALUE_TAG_NAME);
			var numberOfValues = values_xml.length;
		
			/*
			 * case Value array
			 */
			if (numberOfValues > 0){
				/*
				 * return an array with all values
				 */
				object.values = new Array(numberOfValues);
			
				for (var i=0; i < numberOfValues; i++){
					object.values[i] = $(values_xml[i]).text();
				}
			}
		
			/*
			 * case Range child node
			 */
			else{
				object.range = new Object();
			
				var range_xml = allowedValues_xml.find(LITERAL_DATA_ALLOWED_VALUES_RANGE_TAG_NAME);
			
				object.range.minimumValue = range_xml.find(LITERAL_DATA_ALLOWED_VALUES_RANGE_MINIMUM_VALUE_TAG_NAME).text();
				object.range.maximumValue = range_xml.find(LITERAL_DATA_ALLOWED_VALUES_RANGE_MAXIMUM_VALUE_TAG_NAME).text();
			}
		
		return object;	
	},

	createComplexDataInputFromXml : function(xmlNode) {
		var minOccurs = xmlNode.attr(MIN_OCCURS_ATTR_NAME) || xmlNode.attr(MIN_OCCURS_ATTR_NAME_WITH_NS);
		var maxOccurs = xmlNode.attr(MAX_OCCURS_ATTR_NAME) || xmlNode.attr(MAX_OCCURS_ATTR_NAME_WITH_NS);
		
		var title = xmlNode.find(TITLE_TAG_NAME).text();
		var abstractValue = xmlNode.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = xmlNode.find(IDENTIFIER_TAG_NAME).text();
		
		/*
		 * complex data input
		 */
		var formatNodes = this.extractFormatNodes(xmlNode);
		
		var formatArray = this.createFormatArray(formatNodes);
		
		return this.createComplexDataInput(title, abstractValue, identifier, minOccurs, maxOccurs, formatArray);
	},

	createBboxDataInputFromXml : function(xmlNode) {
		
		var minOccurs = xmlNode.attr(MIN_OCCURS_ATTR_NAME) || xmlNode.attr(MIN_OCCURS_ATTR_NAME_WITH_NS);
		var maxOccurs = xmlNode.attr(MAX_OCCURS_ATTR_NAME) || xmlNode.attr(MAX_OCCURS_ATTR_NAME_WITH_NS);
		
		var title = xmlNode.find(TITLE_TAG_NAME).text();
		var abstractValue = xmlNode.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = xmlNode.find(IDENTIFIER_TAG_NAME).text();
		
		//TODO BBOX 
		var formatNodes = this.extractFormatNodes(xmlNode);
		
		/*
		 * in WPS 1.0 there is no format for a bbox input!
		 * 
		 * but in WPS 2.0 there is!
		 * 
		 * Hence, we just add an "|| undefined"
		 */
		var formatArray = this.createFormatArray(formatNodes) || undefined;
		
		var supportedCRSs = this.createCrsArray(xmlNode.find(CRS_TAG_NAME));
		
		return this.createBboxInput(title, abstractValue, identifier, minOccurs, maxOccurs, formatArray, supportedCRSs);

	},
	
	createCrsArray : function(supportedCRSs_xml){
		var supportedCrsArray = new Array(supportedCRSs_xml.length);
		
		for (var index = 0; index < supportedCRSs_xml.length; index++) {			
			supportedCrsArray[index] = $(supportedCRSs_xml[index]).text();
		}
		return supportedCrsArray;
	},
	
	createFormatArray : function(formatNodes) {
		if(formatNodes.length == 0)
			return undefined;
		
		var formatArray = new Array();
		
		for (var index = 0; index < formatNodes.length; index++) {
			var formatXml = $(formatNodes[index]);
			
			var mimeType = this.extractMimeType(formatXml);
			var encoding = this.extractEncoding(formatXml);
			var schema = this.extractSchema(formatXml);
			
			formatArray[index] = this.createFormat(mimeType, encoding, schema);
		}
		return formatArray;
	},
	
	/**
	 * override in child method to extract the mime type from the format xml node.
	 * 
	 * Differs for various WPS versions.
	 */
	extractMimeType : function(formatXml){
		
	},
	
	/**
	 * override in child method to extract the encoding from the format xml node.
	 * 
	 * Differs for various WPS versions.
	 */
	extractEncoding : function(formatXml){
		
	},
	
	/**
	 * override in child method to extract the schema from the format xml node.
	 * 
	 * Differs for various WPS versions.
	 */
	extractSchema : function(formatXml){
		
	},
	
	createOutputs : function (outputNodes){
		 
		var array = new Array(outputNodes.length);
		
		for (var index = 0; index < outputNodes.length; index++) {
			var OutputXml = $(outputNodes[index]);
			
			if(OutputXml.find(LITERAL_DATA_OUTPUT_TAG_NAME).length > 0)
				array[index] = this.createLiteralDataOutputFromXml(OutputXml);
			
			else if (OutputXml.find(COMPLEX_DATA_OUTPUT_TAG_NAME).length > 0)
				array[index] = this.createComplexDataOutputFromXml(OutputXml);
			
			else if (OutputXml.find(BBOX_DATA_OUTPUT_TAG_NAME).length > 0)
				array[index] = this.createBboxDataOutputFromXml(OutputXml);
			
			/*
			 * nested output!
			 */
			else if (OutputXml.find(PROCESS_OUTPUT_TAG_NAME).length > 0)
				array[index] = this.createOutputs(OutputXml);
			
		}
		
		return array;
		
	},
	
	/**
	 * TODO outputs vary... no format for literal data but multiple UOMs...
	 */
	
	createLiteralDataOutputFromXml : function(outputXml){
		var title = outputXml.find(TITLE_TAG_NAME).text();
		var abstractValue = outputXml.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = outputXml.find(IDENTIFIER_TAG_NAME).text();
		
		/*
		 * literal data input
		 */
		var formatNodes = this.extractFormatNodes(outputXml);

		/*
		 * in WPS 1.0 there is no format for a literal otput!
		 * 
		 * but in WPS 2.0 there is!
		 * 
		 * Hence, we just add an "|| undefined"
		 */
		var formatArray = this.createFormatArray(formatNodes) ||undefined;
		
		var literalDataDomainArray = this.createLiteralDataDomainArray(outputXml.find(LITERAL_DATA_TAG_NAME));
	
		return this.createLiteralDataOutput(title, abstractValue, identifier, 
				formatArray, literalDataDomainArray);
	},
	
	createComplexDataOutputFromXml : function(outputXml) {
		
		var title = outputXml.find(TITLE_TAG_NAME).text();
		var abstractValue = outputXml.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = outputXml.find(IDENTIFIER_TAG_NAME).text();
		
		/*
		 * complex data input
		 */
		var formatNodes = this.extractFormatNodes(outputXml);
		
		var formatArray = this.createFormatArray(formatNodes);
		
		return this.createComplexDataOutput(title, abstractValue, 
				identifier, formatArray);
	},
	
	createBboxDataOutputFromXml : function(outputXml) {
		
		var title = outputXml.find(TITLE_TAG_NAME).text();
		var abstractValue = outputXml.find(ABSTRACT_TAG_NAME).text() || undefined;
		var identifier = outputXml.find(IDENTIFIER_TAG_NAME).text();
		
		var formatNodes = this.extractFormatNodes(outputXml);
		/*
		 * in WPS 1.0 there is no format for a bbox output!
		 * 
		 * but in WPS 2.0 there is!
		 * 
		 * Hence, we just add an "|| undefined"
		 */
		var formatArray = this.createFormatArray(formatNodes) || undefined;
		
		var supportedCRSs = this.createCrsArray(outputXml.find(CRS_TAG_NAME));
		
		return this.createBboxOutput(title, abstractValue, identifier, 
				formatArray, supportedCRSs);
	}

});
