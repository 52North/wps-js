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


