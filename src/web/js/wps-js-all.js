/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
	var initializing = false, fnTest = /xyz/.test(function() {
		xyz;
	}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function() {
	};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for ( var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function"
					&& typeof _super[name] == "function"
					&& fnTest.test(prop[name]) ? (function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) : prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

var WPS_VERSION_1_0_0 = "1.0.0"
var WPS_VERSION_2_0_0 = "2.0.0"

var GET_CAPABILITIES_TYPE = "GetCapabilities"; 
var DESCRIBE_PROCESS_TYPE = "DescribeProcess";
var EXECUTE_TYPE = "Execute";
var GET_STATUS_TYPE = "GetStatus";
var GET_RESULT_TYPE = "GetResult";

var OWS_11_NAMESPACE = "http://www.opengis.net/ows/1.1";
var WPS_100_NAMESPACE = "http://www.opengis.net/wps/1.0.0";

var METHOD_POST = "POST";
var METHOD_GET = "GET";
var PARAM_WPS_REQUEST_URL = "wpsRequestUrl";
var PARAM_WPS_REQUEST_TYPE = "wpsRequestType";

var USE_PROXY = false;
var PROXY_URL = "";
var PROXY_TYPE = "";

var USER_TEMPLATE_CAPABILITIES_MARKUP = null;
var USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP = null;
var USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP = null;

var DATA_TYPE_LITERAL = "LITERAL";
var DATA_TYPE_COMPLEX = "COMPLEX";
var DATA_TYPE_BBOX = "BBOX";

function wpsResetSetup() {
	USE_PROXY = false;
	PROXY_URL = "";
	PROXY_TYPE = "";

	USER_TEMPLATE_CAPABILITIES_MARKUP = null;
	USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP = null;
	USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP = null;
}


function equalsString(a, b) {
	if (!a) {
		return false;
	}
	
	if (!b) {
		return false;
	}
	
	return jQuery.trim(a).localeCompare(jQuery.trim(b)) == 0;
}

function stringStartsWith(target, sub) {
	return target.indexOf(sub) == 0;
}

function fillXMLTemplate(template, properties) {
	var result = template;
	
	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			result = result.replace("${"+key+"}", properties[key]);	
		}
	}
	
	return result;
}

function isImageMimetype(mimetype) {
	
	return ($.inArray(mimetype, imageMimetypes) > -1);
}

function stringify(format){

    return '{"mimeType" : "' + (format.mimeType ? format.mimeType : "") + '", "schema" : "' + (format.schema ? format.schema : "") + '", "encoding" : "' + (format.encoding ? format.encoding : "") + '"}';
    
}

function escapeCharactersForSelect(id){

    var result = id.replace(/\./g,"\\.");

    return result;
}

var BaseResponse = Class.extend({
	
	init : function(responseDocument) {
		/*
		 * represents the raw response document returned by the WPS
		 */
		this.responseDocument = responseDocument;
	},

	getRawResponseDocument : function() {
		return this.responseDocument;
	}

});

var CapabilitiesResponse = BaseResponse
		.extend({

			/*
			 * {  
   "capabilities":{  
      "serviceIdentification":{  
         "title":"52°North WPS 3.3.2-SNAPSHOT",
         "abstractValue":"Service based on the 52°North implementation of WPS 1.0.0",
         "keywords":[  
            "WPS",
            "geospatial",
            "geoprocessing"
         ],
         "serviceType":"WPS",
         "serviceTypeVersions":[
         	"ServiceTypeVersion":"1.0.0"
         	]
         "fees":"NONE",
         "accessConstraints":"NONE"
      },
      "serviceProvider":{  
         "providerName":"52North",
         "providerSite":"http://www.52north.org/",
         "serviceContact":{  
            "individualName":"",
            "contactInfo":{  
               "address":{  
                  "deliveryPoint":"",
                  "city":"",
                  "administrativeArea":"",
                  "postalCode":"",
                  "country":"",
                  "electronicMailAddress":""
               }
            }
         }
      },
      "operations":[  
         {  
            "DCP":{  
               "HTTP":{  
                  "get":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService?",
                  "post":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService"
               }
            },
            "name":"GetCapabilities"
         },
         {  
            "DCP":{  
               "HTTP":{  
                  "get":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService?",
                  "post":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService"
               }
            },
            "name":"DescribeProcess"
         }
      ],
      "processes":[  
         {  
            "title":"org.n52.wps.server.algorithm.CSWLoDEnablerStarter",
            "identifier":"org.n52.wps.server.algorithm.CSWLoDEnablerStarter",
            "processVersion":"1.1.0",
            "jobControlOptions":"sync-execute async-execute",
            "outputTransmission":"value reference"
         },
         {  
            "title":"org.n52.wps.server.algorithm.JTSConvexHullAlgorithm",
            "identifier":"org.n52.wps.server.algorithm.JTSConvexHullAlgorithm",
            "processVersion":"1.1.0",
            "jobControlOptions":"sync-execute async-execute",
            "outputTransmission":"value reference"
         }
      ],
      "service":"WPS",
      "version":"2.0.0"
   }
}
			 */

			init : function(wpsResponse) {
				this.responseDocument = wpsResponse;
				
				/*
				 * create an empty new instance of capabilities object
				 */

				this.capabilities = new Object();

				/*
				 * service and version
				 */
				this.capabilities.service = "WPS";
				this.capabilities.version = "";

				/*
				 * service identification
				 */
				this.capabilities.serviceIdentification = new Object();
				this.capabilities.serviceIdentification.title = "";
				this.capabilities.serviceIdentification.abstractValue = "";
				this.capabilities.serviceIdentification.keywords = new Array;
				this.capabilities.serviceIdentification.serviceType = "WPS";
				this.capabilities.serviceIdentification.serviceTypeVersions = new Array;
				this.capabilities.serviceIdentification.fees = "";
				this.capabilities.serviceIdentification.accessConstraints = "";

				/*
				 * service provider
				 */
				this.capabilities.serviceProvider = new Object();
				this.capabilities.serviceProvider.providerName = "";
				this.capabilities.serviceProvider.providerSite = "";
				this.capabilities.serviceProvider.serviceContact = new Object();
				this.capabilities.serviceProvider.serviceContact.individualName = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo = new Object();
				this.capabilities.serviceProvider.serviceContact.contactInfo.address = new Object();
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = "";

				/*
				 * operations with one dummy entry
				 */
				this.capabilities.operations = new Array(1);
				this.capabilities.operations[0] = this.createOperation("dummy",
						"dummyGet", "dummyPost");
				
				/*
				 * languages
				 */
				this.capabilities.languages = new Array();

				/*
				 * processes and dummy entry
				 */
				this.capabilities.processes = new Array(1);
				this.capabilities.processes[0] = this.createProcess("title", "id",
						"procVersion", "jobCOntrolOptions",
						"outputTransmission");

				/*
				 * now let child classes fill this empty instance with values
				 */
				this.instantiate(wpsResponse);

			},

			instantiate : function(wpsResponse) {
				// override this method in child classes to properly set the
				// values
			},
			
			createProcess : function(title, identifier, processVersion, jobControlOutputs,
					outputTransmission) {

				var process = new Object();
				process.title = title;
				process.identifier = identifier;
				process.processVersion = processVersion;
				process.jobControlOptions = jobControlOutputs;
				process.outputTransmission = outputTransmission;

				return process;
			},

			createOperation : function(name, getUrl, postUrl) {
				var operation = new Object();
				operation.DCP = new Object();
				operation.DCP.HTTP = new Object();
				operation.DCP.HTTP.name = name;
				operation.DCP.HTTP.get = getUrl;
				operation.DCP.HTTP.post = postUrl;

				return operation;
			},

			createArrayFromTextValues : function(nodes){
				var array = new Array();
				
				for (var int = 0; int < nodes.length; int++) {
					var textValue = $(nodes[int]).text();
					
					array[int] = textValue;
					
				}
				return array;
			}

		});




/**
 * nearly all values are equal fpr WPS 1.0 and WPS 2.0. Thus most of them are hardcoded here!
 * Only some different values have to be set individually
 */
var CapabilitiesResponse_xml = CapabilitiesResponse.extend({
	
	/**
	 * @wpsResponse should be an XML v2.0.0 WPS Capabilities document
	 */
	instantiate : function(wpsResponse){
		/*
		 * set values
		 */
		
		var xmlCapabilities = $(wpsResponse).find("wps\\:Capabilities, Capabilities");
		
		/*
		 * version and service
		 */
		this.capabilities.version = xmlCapabilities.attr("version");
		this.capabilities.service = xmlCapabilities.attr("service");
		
		/*
		 * service identification
		 */
		var xmlServiceIdentification = xmlCapabilities.find("ows\\:ServiceIdentification, ServiceIdentification");
		this.capabilities.serviceIdentification.title = xmlServiceIdentification.find("ows\\:Title , Title").text();
		this.capabilities.serviceIdentification.abstractValue = xmlServiceIdentification.find("ows\\:Abstract, Abstract").text();
		this.capabilities.serviceIdentification.keywords = this.createArrayFromTextValues(xmlServiceIdentification.find("ows\\:Keyword, Keyword"));
		this.capabilities.serviceIdentification.serviceType = xmlServiceIdentification.find("ows\\:ServiceType, ServiceType").text();
		this.capabilities.serviceIdentification.serviceTypeVersions = this.createArrayFromTextValues(xmlServiceIdentification.find("ows\\:ServiceTypeVersion, ServiceTypeVersion"));
		this.capabilities.serviceIdentification.fees = xmlServiceIdentification.find("ows\\:Fees, Fees").text();
		this.capabilities.serviceIdentification.accessConstraints = xmlServiceIdentification.find("ows\\:AccessConstraints, AccessConstraints").text();
		
		/*
		 * service provider
		 */
		var xmlServiceProvider = $(xmlCapabilities).find("ows\\:ServiceProvider, ServiceProvider");
		this.capabilities.serviceProvider.providerName = xmlServiceProvider.find("ows\\:ProviderName, ProviderName").text() || undefined;
		var providerSiteNode=xmlServiceProvider.find("ows\\:ProviderSite, ProviderSite") || undefined;
		this.capabilities.serviceProvider.providerSite = providerSiteNode.attr("href") || providerSiteNode.attr("xlin\\:href") || providerSiteNode.attr("xlink\\:href") || undefined;
		var serviceContact = xmlServiceProvider.find("ows\\:ServiceContact, ServiceContact") || undefined;
		this.capabilities.serviceProvider.serviceContact.individualName = serviceContact.find("ows\\:IndividualName, IndividualName").text() || undefined;
		var address = serviceContact.find("ows\\:Address, Address");
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = address.find("ows\\:DeliveryPoint, DeliveryPoint").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = address.find("ows\\:City, City").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = address.find("ows\\:AdministrativeArea, AdministrativeArea").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = address.find("ows\\:PostalCode, PostalCode").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = address.find("ows\\:Country, Country").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = address.find("ows\\:ElectronicMailAddress, ElectronicMailAddress").text() || undefined;
		
		/*
		 * operations
		 */
		var operationsMetadata = xmlCapabilities.find("ows\\:OperationsMetadata, OperationsMetadata");
		this.capabilities.operations = this.createOperationsArray(operationsMetadata.find("ows\\:Operation, Operation"));
		
		/*
		 * languages
		 */
		var languages = this.extractAllLanguages(xmlCapabilities);
		this.capabilities.languages = this.createArrayFromTextValues(languages.find("ows\\:Language, Language"));
		
		/*
		 * processes
		 */
		var processOfferings = this.extractProcessOfferings(xmlCapabilities);
		this.capabilities.processes = this.createProcessesArray(this.extractAllProcesses(processOfferings));
	},
	
	/**
	 * extracts all languages.
	 * 
	 * Differs for each WPS version
	 */
	extractAllLanguages : function(xmlCapabilities){
		/*
		 * override in child class
		 */
	},
	
	/**
	 * extracts process offering xml node.
	 * 
	 * Differs for each WPS version
	 */
	extractProcessOfferings : function(xmlCapabilities){
		/*
		 * override in child class
		 */
		return xmlCapabilities.find("wps\\:Contents, Contents");
	},
	
	/**
	 * extracts all process  xml nodes.
	 * 
	 * Differs for each WPS version
	 */
	extractAllProcesses : function(processOfferingsXml){
		/*
		 * override in child class
		 */
	},

	createOperationsArray : function(nodes){
		var array = new Array(nodes.length);
		
		for (var int = 0; int < nodes.length; int++) {
			var xmlOperation = $(nodes[int]);
			var name = xmlOperation.attr("name");
			var getUrlNode=xmlOperation.find("ows\\:Get, Get");
			var getUrl = getUrlNode.attr("href") || getUrlNode.attr("xlin\\:href") || getUrlNode.attr("xlink\\:href");
			var PostUrlNode=xmlOperation.find("ows\\:Post, Post");
			var postUrl = PostUrlNode.attr("href") || PostUrlNode.attr("xlin\\:href") || PostUrlNode.attr("xlink\\:href");
			
			array[int] = this.createOperation(name, getUrl, postUrl);	
		}
		return array;
	},
	
	createProcessesArray : function(nodes){
		var array = new Array(nodes.length);
		
		for (var int = 0; int < nodes.length; int++) {
			var xmlProcess = $(nodes[int]);
			
			var title = xmlProcess.find("ows\\:Title, Title").text();
			var identifier = xmlProcess.find("ows\\:Identifier, Identifier").text();
			var processVersion = xmlProcess.attr("processVersion") || xmlProcess.attr("wps\\:processVersion");
			var jobControlOutputs = this.extractJobControlOptions(xmlProcess);
			var outputTransmission = this.extractOutputTransmission(xmlProcess);
			
			array[int] = this.createProcess(title, identifier, processVersion, jobControlOutputs, outputTransmission);
			
		}
		return array;
	},
	
	/**
	 * extracts jobControlOptions parameter.
	 * 
	 * Differs for each WPS version
	 */
	extractJobControlOptions : function(xmlProcess){
		/*
		 * override in child class
		 */
	},
	
	/**
	 * extracts outputTransmission parameter.
	 * 
	 * Differs for each WPS version
	 */
	extractOutputTransmission : function(xmlProcess){
		/*
		 * override in child class
		 */
	}

});

var CapabilitiesResponse_v1_xml = CapabilitiesResponse_xml.extend({
	
	extractAllLanguages : function(xmlCapabilities){
		return xmlCapabilities.find("wps\\:Languages, Languages").find("wps\\:Supported, Supported");
	},
	
	extractProcessOfferings : function(xmlCapabilities){
		/*
		 * override in child class
		 */
		return xmlCapabilities.find("wps\\:ProcessOfferings, ProcessOfferings");
	},
	
	extractAllProcesses : function(processOfferingsXml){
		return processOfferingsXml.find("wps\\:Process, Process");
	},
	
	extractJobControlOptions : function(xmlProcess){
		/*
		 * override in child class
		 */
		return "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
	},
	
	extractOutputTransmission : function(xmlProcess){
		return "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
	}

});

var CapabilitiesResponse_v2_xml = CapabilitiesResponse_xml.extend({
	
	extractAllLanguages : function(xmlCapabilities){
		return xmlCapabilities.find("ows\\:Languages, Languages");
	},
	
	extractProcessOfferings : function(xmlCapabilities){
		return xmlCapabilities.find("wps\\:Contents, Contents");
	},
	
	extractAllProcesses : function(processOfferingsXml){
		return processOfferingsXml.find("wps\\:ProcessSummary, ProcessSummary");
	},
	
	extractJobControlOptions : function(xmlProcess){
		return xmlProcess.attr("jobControlOptions");
	},
	
	extractOutputTransmission : function(xmlProcess){
		return xmlProcess.attr("outputTransmission");
	}

});

var DescribeProcessResponse = BaseResponse.extend({

	init : function(wpsResponse) {
		this.responseDocument = wpsResponse;
		
		/*
		 * empty process description
		 */
		this.processOffering = new Object();
		
		/*
		 * service and version
		 */
		this.processOffering.service = "WPS";
		this.processOffering.version = "";
		
		/*
		 * process
		 */
		this.processOffering.process = new Object();
		this.processOffering.process.title = "";
		this.processOffering.process.abstractValue = "";
		this.processOffering.process.identifier = "";
		this.processOffering.process.inputs = new Array();
		this.processOffering.process.outputs = new Array();
		
		/*
		 * attributes
		 */
		this.processOffering.processVersion = "";
		this.processOffering.jobControlOptions = [];
		this.processOffering.outputTransmissionModes = [];
		
		this.instantiate(wpsResponse);	
	},
	
	instantiate: function(wpsResponse){
		/*
		 * override this method in child classes to instantiate the object
		 */
	},

	createLiteralDataInput : function(title, abstractValue, identifier,
			minOccurs, maxOccurs, formatArray, literalDataDomainArray) {
		var literalDataInput = new Object();

		this.instantiateCommonInputValues(title, abstractValue, identifier,
				minOccurs, maxOccurs, literalDataInput);

		//TODO what about metadata node?
		literalDataInput.literalData = new Object();
		literalDataInput.literalData.formats = formatArray;
		literalDataInput.literalData.literalDataDomains = literalDataDomainArray;
		
		return literalDataInput;
	},

	createComplexDataInput : function(title, abstractValue, identifier,
			minOccurs, maxOccurs, formatArray) {
		var complexDataInput = new Object();

		this.instantiateCommonInputValues(title, abstractValue, identifier,
				minOccurs, maxOccurs, complexDataInput);

		//TODO what about metadata node?
		complexDataInput.complexData = new Object();
		complexDataInput.complexData.formats = formatArray;
		
		return complexDataInput;

	},
	
	createBboxInput : function(title, abstractValue, identifier, minOccurs, 
			maxOccurs, formatArray, crsArray) {
		
		var bboxInput = new Object();
		
		this.instantiateCommonInputValues(title, abstractValue, identifier,
				minOccurs, maxOccurs, bboxInput);

		//TODO what about metadata node?
		bboxInput.boundingBoxData = new Object();
		bboxInput.boundingBoxData.formats = formatArray;
		
		bboxInput.boundingBoxData.supportedCRSs = crsArray;
		
		return bboxInput;

	},

	createFormat : function(mimeType, encoding, schema) {
		var format = new Object();
		format.mimeType = mimeType;
		format.encoding = encoding;
		format.schema = schema;

		return format;
	},

	instantiateCommonInputValues : function(title, abstractValue, identifier,
			minOccurs, maxOccurs, inputObject) {

		inputObject.title = title;

		inputObject.abstractValue = abstractValue;

		inputObject.identifier = identifier;

		inputObject.minOccurs = minOccurs;

		inputObject.maxOccurs = maxOccurs;
	},
	
	instantiateCommonOutputValues : function(title, abstractValue, identifier,
			outputObject){
		outputObject.title = title;

		outputObject.abstractValue = abstractValue;

		outputObject.identifier = identifier;
	},
	
	createLiteralDataOutput : function(title, abstractValue, identifier,
			formatArray, literalDataDomainArray) {
		var literalDataOutput = new Object();

		this.instantiateCommonOutputValues(title, abstractValue, identifier,
				literalDataOutput);

		//TODO what about metadata node?
		literalDataOutput.literalData = new Object();
		literalDataOutput.literalData.formats = formatArray;
		literalDataOutput.literalData.literalDataDomains = literalDataDomainArray;
		
		return literalDataOutput;
	},

	createComplexDataOutput : function(title, abstractValue, identifier,
			formatArray) {
		var complexDataOutput = new Object();

		this.instantiateCommonOutputValues(title, abstractValue, identifier,
				complexDataOutput);

		//TODO what about metadata node?
		complexDataOutput.complexData = new Object();
		complexDataOutput.complexData.formats = formatArray;
		
		return complexDataOutput;

	},
	
	createBboxOutput : function(title, abstractValue, identifier, 
			formatArray, crsArray) {
		
		var bboxOutput = new Object();
		
		this.instantiateCommonOutputValues(title, abstractValue, identifier,
				bboxOutput);

		//TODO what about metadata node?
		bboxOutput.boundingBoxData = new Object();
		bboxOutput.boundingBoxData.formats = formatArray;
		
		bboxOutput.boundingBoxData.supportedCRSs = crsArray;
		
		return bboxOutput;

	},

});



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

/*
 * Override existing variables to match WPS 1.0 documents
 */
var DescribeProcessResponse_v1_xml = DescribeProcessResponse_xml.extend({

	/*
	 * possibly, some methods have to be overridden, to parse WPS 1.0 documents
	 */
	
	resetParameterVariables : function(){
		PROCESS_OFFERING_VERSION = "1.0.0";

		PROCESS_OFFERING_XML_TAG_NAME = "wps\\:ProcessDescription, ProcessDescription";

		FORMAT_MIME_TYPE_ATTR_NAME = "ows\\:MimeType, MimeType";
		FORMAT_ENCODING_ATTR_NAME = "ows\\:Encoding, Encoding";
		FORMAT_SCHEMA_ATTR_NAME = "ows\\:Schema, Schema";
		
		LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME = "ows\\:UOM, UOM";

		//SUPPORTED_CRS_TAG_NAME = "SupportedCRS";
		CRS_TAG_NAME = "ows\\:CRS, CRS";
		
		LITERAL_DATA_OUTPUT_TAG_NAME = "wps\\:LiteralOutput, LiteralOutput";
		COMPLEX_DATA_OUTPUT_TAG_NAME = "wps\\:ComplexOutput, ComplexOutput";
		BBOX_DATA_OUTPUT_TAG_NAME = "wps\\:BoundingBoxOutput, BoundingBoxOutput";
	},
	
	createJobControlOptions : function(processOfferingXml){

		/*
		 * TODO for WPS 1.0 this attribut does not exist!
		 * But we have the attributes "storeSupported" 
		 * if true, then async-execution and stored as reference!
		 * 
		 * if false, then only sync-execution and return in document is possible.
		 */
		var storeSupported = processOfferingXml.attr("storeSupported") || false;
		if (storeSupported)
			return ["sync-execute", "async-execute"];
		
		else		
			return ["sync-execute"];
	},
	
	createOutputTransmissionModes : function(processOfferingXml){

		/*
		 * TODO for WPS 1.0 this attribut does not exist!
		 * But we have the attributes "storeSupported" 
		 * if true, then async-execution and stored as reference!
		 * 
		 * if false, then only sync-execution and return in document is possible.
		 */
		var storeSupported = processOfferingXml.attr("storeSupported") || false;
		if (storeSupported)
			return ["value", "reference"];
		
		else		
			return ["value"];
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
		return literalDataXml.find("ows\\:UOMs, UOMs").find("ows\\:Default, Default").find(LITERAL_DATA_UNIT_OF_MEASURE_TAG_NAME).text() || undefined;
	},
	
	extractFormatNodes : function(xmlNode){
		/*
		 * in WPS 1.0 formats are split up in a Supported and a Default subtag.
		 * To not have them listed twice, we just extract all Format Nodes from 
		 * the Supported subtag.
		 */
		return xmlNode.find("ows\\:Supported, Supported").find(FORMAT_TAG_NAME);
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

var ExecuteResponse = BaseResponse.extend({

	init : function(wpsResponse) {
		this.responseDocument = wpsResponse;

		/*
		 * executeResponse can be instantiated differentely, depending on the
		 * WPS version and executionMode
		 * 
		 * Hence, we specify some common parameters, that indicate how to
		 * interpret the response
		 */
		this.executeResponse = {

			/*
			 * type shall be used to indicate the type of document
			 */
			type : "",
			serviceVersion : "",
			/*
			 * document will have varying properties as it will be instantiated
			 * differently according to the type
			 */
			responseDocument : {}
		};

		this.instantiate(wpsResponse);
	},

	instantiate : function(wpsResponse) {
		/*
		 * override this method in child classes to instantiate the object
		 */
	},

	/**
	 * will have different properties, depending on the WPS version!
	 */
	instantiateResultDocument : function() {
		this.executeResponse.resultDocument = {

		};
	},

	/**
	 * only relevant for WPS 2.0
	 */
	instantiateStatusInfoDocument : function() {

	},

});

/**
 * Inspects XML response of WPS 1.0 execute request
 */
var ExecuteResponse_v1_xml = ExecuteResponse
		.extend({
			instantiate : function(wpsResponse) {
				if ($(wpsResponse).find("wps\\:ExecuteResponse, ExecuteResponse").length > 0) {
					/*
					 * response document!
					 * 
					 * set the common response parameters
					 */
					this.executeResponse.serviceVersion = "1.0.0";
					this.executeResponse.type = "responseDocument";

					this.instantiateResponseDocument(wpsResponse);
				} else {
					/*
					 * raw output
					 */
					this.executeResponse.serviceVersion = "1.0.0";
					this.executeResponse.type = "rawOutput";

					/*
					 * check whether response is an XML document. 
					 * In that case return the xmlString, 
					 * else return the response directly
					 */
					var rawOutput;
					if(!(typeof wpsResponse === 'string') && ($(wpsResponse).length > 0))
						rawOutput = (new XMLSerializer()).serializeToString(wpsResponse);
					else
						rawOutput = wpsResponse;
					
					this.executeResponse.responseDocument = rawOutput;
				}
			},

			instantiateResponseDocument : function(wpsResponse) {
				var executeResponse_xmlNode = $(wpsResponse).find(
						"wps\\:ExecuteResponse, ExecuteResponse");

				/*
				 * service
				 */
				var service = "WPS";
				var version = "1.0.0";
				var lang = executeResponse_xmlNode.attr("lang")
						|| executeResponse_xmlNode.attr("xml\\:lang");
				/*
				 * statusLocation may not exist
				 */
				var statusLocation = executeResponse_xmlNode
						.attr("statusLocation")
						|| executeResponse_xmlNode.attr("wps\\:statusLocation")
						|| undefined;
				var serviceInstance = executeResponse_xmlNode
						.attr("serviceInstance")
						|| executeResponse_xmlNode.attr("wps\\:serviceInstance");

				/*
				 * process
				 */
				var process_xmlNode = executeResponse_xmlNode.find("wps\\:Process, Process");
				var processId = process_xmlNode.find("ows\\:Identifier, Identifier").text();
				var processTitle = process_xmlNode.find("ows\\:Title, Title").text();
				var process = {
					identifier : processId,
					title : processTitle
				};

				/*
				 * status
				 */
				var status_xmlNode = executeResponse_xmlNode.find("wps\\:Status, Status");
				var statusCreationTime = status_xmlNode.attr("creationTime")
						|| status_xmlNode.attr("wps\\:creationTime");
				var statusInfo = null;
				if (status_xmlNode.find("wps\\:ProcessAccepted, ProcessAccepted").length > 0)
					statusInfo = status_xmlNode.find("wps\\:ProcessAccepted, ProcessAccepted").prop(
							"tagName");
				else if (status_xmlNode.find("wps\\:ProcessStarted, ProcessStarted").length > 0)
					statusInfo = status_xmlNode.find("wps\\:ProcessStarted, ProcessStarted").prop(
							"tagName").concat(" - percentCompleted:").concat(
							status_xmlNode.find("wps\\:ProcessStarted, ProcessStarted").attr(
									"percentCompleted"));
				else if (status_xmlNode.find("wps\\:ProcessPaused, ProcessPaused").length > 0)
					statusInfo = status_xmlNode.find("wps\\:ProcessPaused, ProcessPaused").prop(
							"tagName").concat(" - percentCompleted:").concat(
							status_xmlNode.find("wps\\:ProcessPaused, ProcessPaused").attr(
									"percentCompleted"));
				else if (status_xmlNode.find("wps\\:ProcessSucceeded, ProcessSucceeded").length > 0)
					statusInfo = status_xmlNode.find("wps\\:ProcessSucceeded, ProcessSucceeded").prop(
							"tagName");
				else
					statusInfo = status_xmlNode.find("wps\\:ProcessFailed, ProcessFailed").find(
							"wps\\:ExceptionReport, ows\\:ExceptionReport, ExceptionReport").find("wps\\:ExceptionText, ows\\:ExceptionText, ExceptionText").text()
							|| status_xmlNode.find("wps\\:ProcessFailed, ProcessFailed").find(
									"wps\\:ExceptionReport, ows\\:ExceptionReport, ExceptionReport").attr("exceptionCode");

				var statusInfoTest = status_xmlNode.find("wps\\:ProcessSucceeded, ProcessSucceeded")
						.text();

				var status = {
					creationTime : statusCreationTime,
					info : statusInfo
				};

				/*
				 * TODO lineage=true --> include dataInputs and outputs
				 * definitions?
				 */

				/*
				 * outputs
				 */
				var processOutputs_xmlNode = executeResponse_xmlNode
						.find("wps\\:ProcessOutputs, ProcessOutputs");
				var outputs_xmlNodes = processOutputs_xmlNode.find("wps\\:Output, Output");
				var outputs = this.instantiateOutputs(outputs_xmlNodes);

				/*
				 * create responseDocument
				 */
				this.executeResponse.responseDocument = {
					service : service,
					version : version,
					lang : lang,
					statusLocation : statusLocation,
					serviceInstance : serviceInstance,
					process : process,
					status : status,
					outputs : outputs
				};

			},

			instantiateOutputs : function(outputs_xmlNodes) {
				var outputs = new Array(outputs_xmlNodes.length);

				for (var index = 0; index < outputs_xmlNodes.length; index++) {
					var output_xmlNode = $(outputs_xmlNodes[index]);

					var id = output_xmlNode.find("ows\\:Identifier, Identifier").text();
					var title = output_xmlNode.find("ows\\:Title, Title").text();
					var abstractValue = output_xmlNode.find("ows\\:Abstract, Abstract").text()
							|| undefined;

					/*
					 * either element "Data" or "Reference" exists
					 */
					var reference_xmlNode = output_xmlNode.find("wps\\:Reference, Reference");
					var reference = undefined;
					if (reference_xmlNode.length > 0) {
						reference = {
							href : reference_xmlNode.attr("href")
									|| reference_xmlNode.attr("wps\\:href"),
							format : reference_xmlNode.attr("mimeType") 
									|| reference_xmlNode.attr("format")
									|| undefined,
							encoding : reference_xmlNode.attr("encoding")
									|| undefined,
							schema : reference_xmlNode.attr("schema")
									|| undefined
						}

						outputs[index] = {
							identifier : id,
							title : title,
							abstractValue : abstractValue,
							reference : reference,
						};
					} else {
						/*
						 * Data element
						 */
						var data_xmlNode = output_xmlNode.find("wps\\:Data, Data");

						/*
						 * data can either be a complexData or a LiteralData or
						 * a BoundingBoxData element
						 */
						var data;
						var complexData_xmlNode = data_xmlNode
								.find("wps\\:ComplexData, ComplexData");
						var literalData_xmlNode = data_xmlNode
								.find("wps\\:LiteralData, LiteralData");
						var bboxData_xmlNode = data_xmlNode
								.find("wps\\:BoundingBoxData, BoundingBoxData");
						if (complexData_xmlNode.length > 0) {
							var data = { 
									complexData : {
										mimeType : complexData_xmlNode.attr("mimeType")
											|| undefined,
										schema : complexData_xmlNode.attr("schema")
											|| undefined,
										encoding : complexData_xmlNode.attr("encoding")
											|| undefined,
										value : complexData_xmlNode.html()
									}
								
							}
						} else if (bboxData_xmlNode.length > 0) {
							
							var data = {
									boundingBoxData : {
										crs : bboxData_xmlNode.attr("crs") || undefined,
										dimensions : bboxData_xmlNode
												.attr("dimensions")
												|| undefined,
										lowerCorner : bboxData_xmlNode
												.attr("lowerCorner")
												|| bboxData_xmlNode.find("ows\\:LowerCorner, LowerCorner")
														.text(),
										upperCorner : bboxData_xmlNode
												.attr("upperCorner")
												|| bboxData_xmlNode.find("ows\\:UpperCorner, UpperCorner")
														.text()
									}
								
							}
						} else {
							/*
							 * literalData
							 */
							var data = {
									literalData : {
										dataType : literalData_xmlNode.attr("dataType")
											|| undefined,
										uom : literalData_xmlNode.attr("uom")
											|| undefined,
										value : literalData_xmlNode.text()
									}
								
							}
						}

						outputs[index] = {
							identifier : id,
							title : title,
							abstractValue : abstractValue,
							data : data,
						};
					}

				} // end for
				return outputs;
			}
		});
/**
 * Inspects XML response of WPS 2.0 execute request
 */
var ExecuteResponse_v2_xml = ExecuteResponse.extend({

	instantiate : function(wpsResponse) {
		/*
		 * TODO WPS 2.0 specifies different response possibilities
		 * 
		 * raw data
		 * 
		 * StatusInfo document
		 * 
		 * Response/Result Document
		 * 
		 * Hence, we must implement each possibility and return an appropriate
		 * response
		 */
		if ($(wpsResponse).find("wps\\:Result, Result").length > 0) {
			/*
			 * response/result document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "resultDocument"

			this.instantiateResultDocument(wpsResponse);
		} else if ($(wpsResponse).find("wps\\:StatusInfo, StatusInfo").length > 0) {
			/*
			 * response/result document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "statusInfoDocument";

			this.instantiateStatusInfoDocument(wpsResponse);
		} else {
			/*
			 * raw output
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "rawOutput";

			/*
			 * check whether response is an XML document. 
			 * In that case return the xmlString, 
			 * else return the response directly
			 */
			var rawOutput;
			if(!(typeof wpsResponse === 'string') && ($(wpsResponse).length > 0))
				rawOutput = (new XMLSerializer()).serializeToString(wpsResponse);
			else
				rawOutput = wpsResponse;
			
			this.executeResponse.responseDocument = rawOutput;
		}
	},

	instantiateResultDocument : function(wpsResponse) {

		var result_xmlNode = $(wpsResponse).find("wps\\:Result, Result");

		var jobId = result_xmlNode.find("wps\\:JobID, JobID").text() || undefined;
		var expirationDate = result_xmlNode.find("wps\\:ExpirationDate, ExpirationDate").text()
				|| undefined;

		var outputs = this.instantiateOutputs(result_xmlNode.find("wps\\:Output, Output"));

		this.executeResponse.responseDocument = {
			jobId : jobId,
			expirationDate : expirationDate,
			outputs : outputs
		};
	},

	instantiateOutputs : function(outputs_xmlNodes) {
		var outputs = new Array(outputs_xmlNodes.length);

		for (var index = 0; index < outputs_xmlNodes.length; index++) {
			var output_xmlNode = $(outputs_xmlNodes[index]);

			/*
			 * either element "Data" or "Reference" exists
			 */
			var reference_xmlNode = output_xmlNode.find("wps\\:Reference, Reference");
			var reference = undefined;
			if (reference_xmlNode.length > 0) {
				reference = {
					href : reference_xmlNode.attr("href")
							|| reference_xmlNode.attr("wps:href")
							|| reference_xmlNode.attr("xlin:href")
							|| reference_xmlNode.attr("xlink:href")
							|| reference_xmlNode.attr("ows:href")
							|| reference_xmlNode.attr("wps\\:href") 
							|| reference_xmlNode.attr("xlin\\:href"),
					format : reference_xmlNode.attr("mimeType") 
							|| reference_xmlNode.attr("format")
							|| undefined,
					encoding : reference_xmlNode.attr("encoding")
							|| undefined,
					schema : reference_xmlNode.attr("schema")
							|| undefined
				}

				outputs[index] = {
					identifier : output_xmlNode.attr("id"),
					reference : reference
				};
			}
			else{
				
				/*
				 * Data node;
				 * 
				 * in WPS 2.0.0 this node may either have a subnode named: 
				 * - "LiteralValue" or 
				 * - "BoundingBox" or 
				 * - directValue for
				 * complexOutput --> complex output does not have an own subNode!!!
				 */
				var data_xmlNode = output_xmlNode.find("wps\\:Data, Data");

				/*
				 * data can either be a LiteralValue or a
				 * BoundingBox element
				 */
				var data;
				var literalData_xmlNode = data_xmlNode.find("wps\\:LiteralValue, LiteralValue");
				var bboxData_xmlNode = data_xmlNode.find("ows\\:BoundingBox, BoundingBox");
				if (literalData_xmlNode.length > 0) {
					
					/*
					 * literalData
					 */
					data = {
						literalData : {
							dataType : literalData_xmlNode.attr("dataType")
									|| undefined,
							uom : literalData_xmlNode.attr("uom") || undefined,
							value : literalData_xmlNode.text()
						}

					}
					
					
				} else if (bboxData_xmlNode.length > 0) {

					data = {
						boundingBoxData : {
							crs : bboxData_xmlNode.attr("crs") || undefined,
							dimensions : bboxData_xmlNode.attr("dimensions")
									|| undefined,
							lowerCorner : bboxData_xmlNode.attr("lowerCorner")
									|| bboxData_xmlNode.find("ows\\:LowerCorner, LowerCorner").text(),
							upperCorner : bboxData_xmlNode.attr("upperCorner")
									|| bboxData_xmlNode.find("ows\\:UpperCorner, UpperCorner").text()
						}

					}
				} else {
					/*
					 * complex data
					 */
					data = {
							complexData : {
								mimeType : data_xmlNode.attr("mimeType")
										|| undefined,
								schema : data_xmlNode.attr("schema")
										|| undefined,
								encoding : data_xmlNode.attr("encoding")
										|| undefined,
								value : data_xmlNode.html()
							}

						}
				}

				/*
				 * TODO nested Output!
				 */

				outputs[index] = {
					identifier : output_xmlNode.attr("id"),
					data : data
				};			
			} // end else data or reference
		} // end for

		return outputs;
	},

	instantiateStatusInfoDocument : function(wpsResponse) {
		var statusInfo_xmlNode = $(wpsResponse).find("wps\\:StatusInfo, StatusInfo");

		var jobId = statusInfo_xmlNode.find("wps\\:JobID, JobID").text();
		var status = statusInfo_xmlNode.find("wps\\:Status, Status").text();
		var expirationDate = statusInfo_xmlNode.find("wps\\:ExpirationDate, ExpirationDate").text()
				|| undefined;
		var estimatedCompletion = statusInfo_xmlNode
				.find("wps\\:EstimatedCompletion, EstimatedCompletion").text()
				|| undefined;
		var nextPoll = statusInfo_xmlNode.find("wps\\:NextPoll, NextPoll").text() || undefined;
		var percentCompleted = statusInfo_xmlNode.find("wps\\:PercentCompleted, PercentCompleted")
				.text()
				|| undefined;

		this.executeResponse.responseDocument = {
			jobId : jobId,
			status : status,
			expirationDate : expirationDate,
			estimatedCompletion : estimatedCompletion,
			nextPoll : nextPoll,
			percentCompleted : percentCompleted
		};
	}

});
var ResponseFactory = Class.extend({

	init : function(settings) {
		this.settings = settings;
	},

	/**
	 * Since the returned documents of the WPS differ with respect to the
	 * service version, the matching result document has to be instantiated
	 * 
	 * @requestObject the request object that created the responseFactory. It is
	 *                used to resolve the response type
	 */
	resolveResponseHandler : function(wpsResponse, requestObject) {

		/*
		 * version and requestType will be compared to constant values from Constants.js
		 */
		var version = requestObject.settings.version;
		var requestType = requestObject.settings.requestType;

		if (requestType == GET_CAPABILITIES_TYPE) {
			if (version == WPS_VERSION_1_0_0)
				return new CapabilitiesResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new CapabilitiesResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == DESCRIBE_PROCESS_TYPE) {

			if (version == WPS_VERSION_1_0_0)
				return new DescribeProcessResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new DescribeProcessResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == EXECUTE_TYPE) {

			if (version == WPS_VERSION_1_0_0)
				return new ExecuteResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new ExecuteResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == GET_STATUS_TYPE) {
				return new ExecuteResponse_v2_xml(wpsResponse);

		} else if (requestType == GET_RESULT_TYPE) {
				return new ExecuteResponse_v2_xml(wpsResponse);

		}else {
			// TODO
			return new ExceptionReportResponse(wpsResponse);
		}

		return null;
	}

});

var TEMPLATE_EXCEPTION_REPORT_RESPONSE_MARKUP = '\
	<div class="wps-exception-report-response"> \
		<div class="wps-exception-report-response-exceptions"> \
			<ul class="wps-exception-list" id="wps-exception-list"> \
			</ul> \
		</div> \
		<div id="wps-exception-report-response-extension"></div> \
	</div>';

var TEMPLATE_EXCEPTION_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Code</label><span class="wps-item-error-value">${code}</span> \
	</li> \
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Text</label><span class="wps-item-error-message-value">${text}</span> \
	</li>';

var ExceptionReportResponse = BaseResponse
		.extend({

			createMarkup : function() {
				var exceptionsFromResponse = this.xmlResponse
						.getElementsByTagNameNS(OWS_11_NAMESPACE, "Exception");

				console.log("Got exception response!");
				exceptions = jQuery(exceptionsFromResponse);
				console.log(exceptions);

				var parsedExceptions = [];
				for ( var i = 0; i < exceptions.length; i++) {
					var exc = jQuery(exceptions[i]);

					var parsedExc = {
						"code" : exc.attr("exceptionCode"),
						"text" : exc.text().trim()
					};
					parsedExceptions.push(parsedExc);
				}

				var properties = {};
				var result = jQuery.tmpl(
						TEMPLATE_EXCEPTION_REPORT_RESPONSE_MARKUP, properties);
				var exceptionList = result.children('#wps-exception-list');

				// var extensionDiv = result
				// .children('#wps-exception-report-response-extension');

				// TODO FIXME display exceptions
				if (parsedExceptions && !jQuery.isEmptyObject(parsedExceptions)) {
					jQuery(parsedExceptions)
							.each(
									function(key, value) {
										alert(key + " - " + value.code + ": "
												+ value.text);
											jQuery
													.tmpl(
															TEMPLATE_EXCEPTION_MARKUP,
 															value).appendTo(
															exceptionList);
									});
				}

				return result;
			}

		});

var BaseRequest = Class.extend({
	init : function(settings) {
		this.settings = settings;
		
		this.addRequestTypeToSettings();
	},
	
	addRequestTypeToSettings: function(){
		//override this method to add a request type to the settings object 
	},

	getSettings : function() {
		return this.settings;
	},

	execute : function(callback) {
		/*
		 * define a callback which gets called after finishing the request
		 */
		this.callback = callback;

		this.preRequestExecution();

		this.executeHTTPRequest(this.prepareHTTPRequest());

		this.postRequestExecution();
	},

	preRequestExecution : function() {
	},

	postRequestExecution : function() {

	},

	processResponse : function(xml) {

	},

	prepareHTTPRequest : function() {
		return null;
	},

	executeHTTPRequest : function(requestSettings) {
		/*
		 * we need 'self' as 'this' is different in the anonymous callbacks
		 */
		var self = this;

		var combinedRequestSettings = jQuery.extend({
			success : function(responseData) {
				/*
				 * create an appropriate response document (which depends on the
				 * request type)
				 */
				var respFactory = new ResponseFactory();
				var response = respFactory.resolveResponseHandler(responseData,
						self);

				/*
				 * if a callback function has been defined, then call it with
				 * the response object
				 */
				if (self.callback) {
					self.callback(response);
				}

				return response;
			},
			error : function(jqXHR, textStatus, errorThrown) {
				/*
				 * error handling, return textStatus and errorThrown as new
				 * object
				 */

				var errorResponse = {
					textStatus : textStatus,
					errorThrown : jqXHR.responseText
				}
				
				/*
				 * if a callback function has been defined, then call it with
				 * the response object
				 */
				if (self.callback) {
					self.callback(errorResponse);
				}
				
			}
		}, requestSettings);

		var targetUrl;
		if (USE_PROXY) {
			if (PROXY_TYPE == "parameter") {
				targetUrl = PROXY_URL + encodeURIComponent(this.settings.url);
			} else {
				// TODO split URL into host-base + query and create new
				targetUrl = this.settings.url;
			}
		} else {
			targetUrl = this.settings.url;
		}
		jQuery.ajax(targetUrl, combinedRequestSettings);
	}
});


var GetRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		var targetUrl = this.settings.url;
		var targetUrlQuery = this.settings.urlQuery;
		
		//check for a query part
		if (!targetUrlQuery) {
			targetUrlQuery = this.createTargetUrlQuery();
		}
		
		if (targetUrlQuery) {
			this.settings.url = this.buildTargetUrl(targetUrl, targetUrlQuery);
		}
		
		return {
			type : "GET"
		};
	},
	
	/*
	 * overwrite this method to define specific behavior
	 */
	createTargetUrlQuery : function() {
		return null;
	},
	
	buildTargetUrl : function(targetUrl, targetUrlQuery) {
		if (targetUrl.indexOf("?") == -1) {
			targetUrl += "?";
		}
		
		if (targetUrl.indexOf("service=") == -1) {
			targetUrl += "service=WPS";
		}
		
		if (targetUrl.indexOf("version=") == -1) {
			targetUrl += "&version=" + this.settings.version;
		}
		
		if (targetUrlQuery) {
			targetUrl += "&" + targetUrlQuery;
		}
		
		return encodeURI(targetUrl);
	}

});


var PostRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		var payload = this.settings.data;
		if (!payload) {
			payload = this.createPostPayload();
		}
		
		return {
			type : "POST",
			data : payload,
			contentType : "text/xml"
		};
	},
	
	/*
	 * overwrite this method to create specific payload
	 */
	createPostPayload : function() {
		return null;
	},
	
	fillTemplate : function(template, properties) {
		return fillXMLTemplate(template, properties);
	}

});

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
			 * 
			 * @identifier input identifier
			 * @dataType data type of the input; may be 'undefined'
			 * @uom unit of measure; may be 'undefined'
			 * @value the literal value of the input
			 */
			createLiteralDataInput_wps_1_0_and_2_0 : function(identifier, dataType,
					uom, value) {
				var input = new Object({
					type : "literal",
					identifier : identifier,
					dataType : dataType || undefined,
					uom : uom || undefined,
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
			 * @identifier input identifier
			 * @mimeType MIME type of the input; may be 'undefined'
			 * @schema reference to a schema; may be 'undefined'
			 * @encoding encoding; may be 'undefined'
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
					mimeType : mimeType || undefined,
					schema : schema || undefined,
					encoding : encoding || undefined,
					asReference : asReference || false,
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
			 * @identifier input identifier
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
					dimension : dimension || undefined,
					lowerCorner : lowerCorner,
					upperCorner : upperCorner
				});

				return input;
			},

		});
/**
 * Helper class to construct output objects for execute requests against WPS 1.0
 * and 2.0
 */
var OutputGenerator = Class.extend({
	/**
	 * 
	 */
	init : function(settings) {
		this.settings = settings;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @identifier output identifier
	 * @mimeType MIME type of the input; may be 'undefined'
	 * @schema reference to a schema; may be 'undefined'
	 * @encoding encoding; may be 'undefined'
	 * @uom unit of measure; may be 'undefined'
	 * @asReference boolean, "true" or "false"
	 * @title new title
	 * @abstractValue new description as text of the 'Abstract' element
	 * 				  of the response document
	 */
	createComplexOutput_WPS_1_0 : function(identifier, mimeType, schema,
			encoding, uom, asReference, title, abstractValue) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType || undefined,
			schema : schema || undefined,
			encoding : encoding || undefined,
			uom : uom || undefined,
			asReference : asReference || false,
			title : title  || undefined,
			abstractValue : abstractValue || undefined
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier
	 * 
	 * @identifier output identifier
	 * @asReference boolean, "true" or "false"
	 */
	createLiteralOutput_WPS_1_0 : function(identifier, asReference) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
			asReference : asReference || false
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier and transmission
	 * 
	 * the rest might be set to 'undefined'!
	 * 
	 * @identifier output identifier
	 * @mimeType MIME type of the input; may be 'undefined'
	 * @schema reference to a schema; may be 'undefined'
	 * @encoding encoding; may be 'undefined'
	 * @transmission either "value" or "reference"
	 */
	createComplexOutput_WPS_2_0 : function(identifier, mimeType, schema,
			encoding, transmission) {
		var output = new Object({
			type : "complex",
			identifier : identifier,
			mimeType : mimeType || undefined,
			schema : schema || undefined,
			encoding : encoding || undefined,
			transmission : transmission  || "value"
		});

		return output;
	},

	/**
	 * the following parameters are mandatory: identifier and transmission
	 * 
	 * @identifier output identifier
	 * @transmission either "value" or "reference"
	 */
	createLiteralOutput_WPS_2_0 : function(identifier, transmission) {
		var output = new Object({
			type : "literal",
			identifier : identifier,
			transmission : transmission  || "value"
		});

		return output;
	}

});
/*
 * the following variables define XML templates that will be instantiated 
 * during request building!
 * 
 * in child classes they should be overridden to reflect the correct 
 * WPS version POST request
 */

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

var EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ALL_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Reference schema="${schema}" mimeType="${mimeType}" encoding="${encoding}"\
	xlink:href="${complexPayload}"/>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_SCHEMA_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Reference schema="${schema}" mimeType="${mimeType}"\
	xlink:href="${complexPayload}"/>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ENCODING_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Reference encoding="${encoding}" mimeType="${mimeType}"\
	xlink:href="${complexPayload}"/>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Reference mimeType="${mimeType}"\
	xlink:href="${complexPayload}"/>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_TYPE = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
      <wps:LiteralData dataType="${dataType}">${value}</wps:LiteralData>\
    </wps:Data>\
  </wps:Input>';

var EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL = '<wps:Input>\
    <ows:Identifier>${identifier}</ows:Identifier>\
    <wps:Data>\
      <wps:LiteralData dataType="${dataType}" uom="${uom}">${value}</wps:LiteralData>\
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

var EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_ALL = '<wps:ResponseForm>\
	    <wps:RawDataOutput mimeType="${mimeType}" schema="${schema}" encoding="${encoding}" \
			uom="${uom}">\
	      <ows:Identifier>${identifier}</ows:Identifier>\
	    </wps:RawDataOutput>\
	  </wps:ResponseForm>';

var EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_ENCODING_UOM = '<wps:ResponseForm>\
    <wps:RawDataOutput mimeType="${mimeType}" encoding="${encoding}"\
		uom="${uom}">\
      <ows:Identifier>${identifier}</ows:Identifier>\
    </wps:RawDataOutput>\
  </wps:ResponseForm>';

var EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_UOM = '<wps:ResponseForm>\
    <wps:RawDataOutput mimeType="${mimeType}" \
		uom="${uom}">\
      <ows:Identifier>${identifier}</ows:Identifier>\
    </wps:RawDataOutput>\
  </wps:ResponseForm>';

var EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE = '<wps:ResponseForm>\
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

var EXECUTE_REQUEST_XML_COMPLEX_OUTPUT = '<wps:Output \
	asReference="${asReference}">\
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
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = EXECUTE_TYPE;
	},

	createPostPayload : function() {
		
		/*
		 * used to reset all templates to reflect differences in different WPS version.
		 */
		this.overrideTemplates();
		
		/*
		 * used to analyze the given request parameters and, if needed, 
		 * add additional parameters to properly instantiate the templates.
		 */
		this.addVersionDependentProperties();
		
		/**
		 * instantiate templates
		 */
		return this.fillTemplates();
	},
	
	/**
	 * will adjust the templates stored in aforementioned variables to reflect 
	 * the WPS version dependent execute request POST body
	 */
	overrideTemplates : function(){
		/*
		 * override in child methods
		 */
	},
	

	/**
	* used to analyze the given request parameters and, if needed,
	* add additional parameters to properly instantiate the
	* templates.
	*/
	addVersionDependentProperties : function(){
		/*
		 * override in child methods
		 */
		
		/*
		 * inspect missing values and instantiate with defaults
		 */
		if (!this.settings.executionMode)
			this.settings.executionMode = "async";

		if (!this.settings.responseFormat)
			this.settings.responseFormat = "document";
	},
	
	/**
	 * add certain parameters, if necessary, to the given object
	 */
	addVersionDependentPropertiesToFinalExecuteProperties : function(finalExecuteProperties){
		/*
		 * override in child classes
		 */
		return finalExecuteProperties;
	},
	
	/**
	 * instantiate all templates and concat them to create the POST body
	 */
	fillTemplates : function(){
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
		
		var finalExecuteProperties = {
				processIdentifier: this.settings.processIdentifier,
				dataInputs: dataInputsMarkup,
				responseForm: responseFormMarkup
		};
		
		finalExecuteProperties = this.addVersionDependentPropertiesToFinalExecuteProperties(finalExecuteProperties);
		
		var result = this.fillTemplate(EXECUTE_REQUEST_XML_START, finalExecuteProperties);
		
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
			if(input.uom)
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL, input);
			else
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_TYPE, input);
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
			if (input.schema && input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ALL_INPUT, input);
			}
			
			else if (input.schema && !input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_SCHEMA_INPUT, input);
			}
			
			else if (!input.schema && input.encoding) {
				markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_ENCODING_INPUT, input);
			}
			
			else {
			    markup = this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_DATA_BY_REFERENCE_INPUT, input);
			}
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
		var result;
		
		if(this.settings.responseFormat == "raw" && outputs.length == 1){
			/*
			 * raw output requested, only one output allowed. So take the first one.
			 */
			var rawOutput = outputs[0];
			
			if (rawOutput.encoding && rawOutput.schema && rawOutput.mimeType && rawOutput.uom){
				result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_ALL, rawOutput);
			}
			else if (rawOutput.encoding && rawOutput.mimeType && rawOutput.uom){
				result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_ENCODING_UOM, rawOutput);
			}
			else if (rawOutput.mimeType && rawOutput.uom){
				result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE_UOM, rawOutput);
			}
			else {
				result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_RAW_TYPE, rawOutput);
			}
			
		}
		else{
			/*
			 * response document with additional attributes and multiple outputs!
			 */
			for (var i = 0; i < outputs.length; i++) {
				if (equalsString("literal", outputs[i].type)) {
					outputString += this.fillTemplate(EXECUTE_REQUEST_XML_LITERAL_OUTPUT, outputs[i]);
				}
				else {
					if (outputs[i].encoding && outputs[i].schema && outputs[i].mimeType) {
						outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_ALL_OUTPUT, outputs[i]);
					}
				
					else if (outputs[i].encoding && !outputs[i].schema && outputs[i].mimeType) {
						outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_ENCODING_OUTPUT, outputs[i]);
					}
				
					else if (!outputs[i].encoding && outputs[i].schema && outputs[i].mimeType) {
						outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_SCHEMA_OUTPUT, outputs[i]);
					}
				
					else if (outputs[i].mimeType){
						outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_MIME_TYPE_OUTPUT, outputs[i]);
					}
					else{
						outputString += this.fillTemplate(EXECUTE_REQUEST_XML_COMPLEX_OUTPUT, outputs[i]);
					}
				}
			}
			
			outputStyle.outputs = outputString;
			
			result = this.fillTemplate(EXECUTE_REQUEST_XML_RESPONSE_FORM_DOCUMENT, outputStyle);
		}	
		
		return result;
	}
	
});

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
		    <wps:Data mimeType="text/xml">\
				<wps:LiteralValue dataType="${dataType}">${value}</wps:LiteralValue>\
			</wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_INPUT_ALL = '<wps:Input id="${identifier}">\
		    <wps:Data mimeType="text/xml">\
				<wps:LiteralValue dataType="${dataType}" uom="${uom}">${value}</wps:LiteralValue>\
			</wps:Data>\
		  </wps:Input>';

				EXECUTE_REQUEST_XML_LITERAL_DATA_NO_TYPE_INPUT = '<wps:Input id="${identifier}">\
		    <wps:Data mimeType="text/xml">\
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

var DescribeProcessGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = DESCRIBE_PROCESS_TYPE;
	},

	createTargetUrlQuery : function() {
		var result = "request=DescribeProcess&identifier="+this.settings.processIdentifier;
		
		return result;
	}
	
});

var GetCapabilitiesGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_CAPABILITIES_TYPE;
	},

	createTargetUrlQuery : function() {
		return "request=GetCapabilities";
	}

});




var DescribeProcessPostRequest = PostRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = DESCRIBE_PROCESS_TYPE;
	},

	createPostPayload : function() {
		
		var DESCRIBE_PROCESS_POST = "";
		var processIdentifier = this.settings.processIdentifier;
		var serviceVersion = this.settings.version;
		
		if(serviceVersion == WPS_VERSION_1_0_0)
		 DESCRIBE_PROCESS_POST = '<DescribeProcess \
			xmlns="http://www.opengis.net/wps/1.0.0" \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS" version="1.0.0">\
			<ows:Identifier>' + processIdentifier + '</ows:Identifier>\
		</DescribeProcess>';
		
		else
			DESCRIBE_PROCESS_POST = '<DescribeProcess \
				service="WPS" \	version="' + serviceVersion +'" \
				xmlns="http://www.opengis.net/wps/2.0" \
				xmlns:ows="http://www.opengis.net/ows/2.0" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
				xsi:schemaLocation="http://www.opengis.net/wps/2.0 http://schemas.opengis.net/wps/2.0/wpsDescribeProcess.xsd">\
				<ows:Identifier>' + processIdentifier + '</ows:Identifier>\
			</DescribeProcess>';
		
		return DESCRIBE_PROCESS_POST;
	}
	
});



var GetCapabilitiesPostRequest = PostRequest.extend({

	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_CAPABILITIES_TYPE;
	},
	
	createPostPayload : function() {
		var GET_CAPABILITIES_POST = "";
		
		var serviceVersion = this.settings.version;
		
		if(serviceVersion == WPS_VERSION_1_0_0)
			GET_CAPABILITIES_POST = '<wps:GetCapabilities \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:wps="http://www.opengis.net/wps/1.0.0" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS">\
		    <wps:AcceptVersions>\
				<ows:Version>' + serviceVersion + '</ows:Version>\
			</wps:AcceptVersions>\
			</wps:GetCapabilities>';
		
		else{
			GET_CAPABILITIES_POST = '<wps:GetCapabilities \
				service="WPS" \
				xmlns:ows="http://www.opengis.net/ows/2.0" \
				xmlns:wps="http://www.opengis.net/wps/2.0" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
				xsi:schemaLocation="http://www.opengis.net/wps/2.0 http://schemas.opengis.net/wps/2.0/wpsGetCapabilities.xsd"> \
				</wps:GetCapabilities>';
		}
		
		return GET_CAPABILITIES_POST;
	}
	
});

/**
 * 
 */
var GetStatusGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_STATUS_TYPE;
	},

	createTargetUrlQuery : function() {
		var result = "request=GetStatus&jobId="+this.settings.jobId;
		
		return result;
	}
	
});
/**
 * 
 */
var GetResultGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_RESULT_TYPE;
	},

	createTargetUrlQuery : function() {
		var result = "request=GetResult&jobId="+this.settings.jobId;
		
		return result;
	}
	
});
// refers to Constant.js
var defaultWpsVersion = WPS_VERSION_1_0_0;

/**
 * requires Constants.js!
 */
var WpsService = Class.extend({

	/**
	 * 
	 */
	init : function(settings) {
		this.settings = settings;

		if (!this.settings.version || (this.settings.version != '1.0.0' && this.settings.version != '2.0.0'))
			this.settings.version = defaultWpsVersion;
	},

	/**
	 * allowed values : "1.0.0" or "2.0.0"
	 * 
	 * requires Constant.js
	 */
	setVersion : function(version) {
		if (version == WPS_VERSION_1_0_0 || version == WPS_VERSION_2_0_0)
			this.settings.version = version;
	},

	/**
	 * set base URL of target WPS
	 */
	setUrl : function(url) {
		this.settings.url = url;
	},

	/**
	 * getCapabilities via HTTP GET
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method
	 */
	getCapabilities_GET : function(callbackFunction) {
		var capabilitiesRequest;

		/**
		 * getCapabilities via HTTP GET
		 * 
		 * @callbackFunction is triggered on success-event of JQuery.ajax
		 *                   method. Takes the response object as argument
		 */
		capabilitiesRequest = new GetCapabilitiesGetRequest({
			url : this.settings.url,
			version : this.settings.version
		});

		capabilitiesRequest.execute(callbackFunction);
	},

	/**
	 * getCapabilities via HTTP POST
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 */
	getCapabilities_POST : function(callbackFunction) {
		var capabilitiesRequest;

		/*
		 * TODO has to be instantiated depending on the version
		 */
		capabilitiesRequest = new GetCapabilitiesPostRequest({
			url : this.settings.url,
			version : this.settings.version
		});

		capabilitiesRequest.execute(callbackFunction);
	},

	/**
	 * process description via HTTP GET
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 * @processIdentifier the identifier of the process
	 */
	describeProcess_GET : function(callbackFunction, processIdentifier) {
		var processDescriptionRequest;

		processDescriptionRequest = new DescribeProcessGetRequest({
			url : this.settings.url,
			version : this.settings.version,
			processIdentifier : processIdentifier
		});

		processDescriptionRequest.execute(callbackFunction);
	},

	/**
	 * process description via HTTP POST
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 * @processIdentifier the identifier of the process
	 */
	describeProcess_POST : function(callbackFunction, processIdentifier) {
		var processDescriptionRequest;

		processDescriptionRequest = new DescribeProcessPostRequest({
			url : this.settings.url,
			version : this.settings.version,
			processIdentifier : processIdentifier
		});

		processDescriptionRequest.execute(callbackFunction);
	},

	/**
	 * WPS execute request via HTTP POST
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 * @processIdentifier the identifier of the process
	 * @responseFormat either "raw" or "document", default is "document"
	 * @executionMode either "sync" or "async";
	 * @lineage only relevant for WPS 1.0; boolean, if "true" then returned
	 *          response will include original input and output definition
	 * @inputs an array of needed Input objects, use JS-object InputGenerator to
	 *         create inputs
	 * @outputs an array of requested Output objects, use JS-object
	 *          OutputGenerator to create inputs
	 */
	execute : function(callbackFunction, processIdentifier, responseFormat,
			executionMode, lineage, inputs, outputs) {
		var executeRequest;

		if (this.settings.version == WPS_VERSION_1_0_0) {
			executeRequest = new ExecuteRequest_v1({
				url : this.settings.url,
				version : this.settings.version,
				processIdentifier : processIdentifier,
				responseFormat : responseFormat,
				executionMode : executionMode,
				lineage : lineage,
				inputs : inputs,
				outputs : outputs
			});
		}

		else {
			executeRequest = new ExecuteRequest_v2({
				url : this.settings.url,
				version : this.settings.version,
				processIdentifier : processIdentifier,
				responseFormat : responseFormat,
				executionMode : executionMode,
				inputs : inputs,
				outputs : outputs
			});
		}

		executeRequest.execute(callbackFunction);
	},

	/**
	 * Only important for WPS 1.0
	 * 
	 * @callbackFunction a callback function that will be triggered with the
	 *                   parsed executeResponse as argument
	 * @storedExecuteResponseLocation the url, where the execute response
	 *                                document is located / can be retrieved
	 *                                from
	 */
	parseStoredExecuteResponse_WPS_1_0 : function(callbackFunction,
			storedExecuteResponseLocation) {
		/*
		 * TODO the url stores a ready-to-be-parsed executeResponse. This should
		 * be parsed as ExecuteResponse_v1_xml object
		 * 
		 * GET request against that URL
		 */
		$.ajax({
			url : storedExecuteResponseLocation,
			success : function(executeResponseXML) {
				/*
				 * create the executeResponse as JavaScript object
				 */
				var executeResponse = new ExecuteResponse_v1_xml(
						executeResponseXML);

				/*
				 * call callback function and pass executeResponse-object as
				 * argument
				 */
				callbackFunction(executeResponse);
			}
		});
	},

	/**
	 * WPS 2.0 getStatus operation to retrieve the status of an executed job
	 * 
	 * Not usable with WPS 1.0
	 * 
	 * @callbackFunction a callback function that will be triggered with the
	 *                   parsed StatusInfo document as argument
	 * @jobId the ID of the asynchronously executed job                  
	 */
	getStatus_WPS_2_0 : function(callbackFunction, jobId) {
		if (this.settings.version == WPS_VERSION_2_0_0) {
			var getStatusRequest;

			getStatusRequest = new GetStatusGetRequest({
				url : this.settings.url,
				version : this.settings.version,
				jobId : jobId
			});

			getStatusRequest.execute(callbackFunction);
		}
		else{
			/*
			 * not supported for WPS 1.0
			 */
			throw "Get Status operation is only supported for WPS 2.0!";
		}
	},
	
	/**
	 * WPS 2.0 getStatus operation to retrieve the status of an executed job
	 * 
	 * Not usable with WPS 1.0
	 * 
	 * @callbackFunction a callback function that will be triggered with the
	 *                   parsed StatusInfo document as argument
	 * @jobId the ID of the asynchronously executed job
	 */
	getResult_WPS_2_0 : function(callbackFunction, jobId) {
		if (this.settings.version == WPS_VERSION_2_0_0) {
			var getResultRequest;

			getResultRequest = new GetResultGetRequest({
				url : this.settings.url,
				version : this.settings.version,
				jobId : jobId
			});

			getResultRequest.execute(callbackFunction);
		}
		else{
			/*
			 * not supported for WPS 1.0
			 */
			throw "Get Result operation is only supported for WPS 2.0!";
		}
	},

});