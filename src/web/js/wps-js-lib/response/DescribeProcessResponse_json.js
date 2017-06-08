// IDEA: The API's internal format and the format the REST binding proxy provides should be identical so that it can be used directly
var DescribeProcessResponse_json = DescribeProcessResponse.extend({
	instantiate: function(wpsResponse) {
		// IDEA: possibly remove underscores from property names?
		
		// TODO-CF: not specified in example response! Using standard values for now.
		this.processOffering.service = "WPS";
		this.processOffering.version = "2.0.0";
		
		this.processOffering.process.title = wpsResponse.ProcessOffering.Process.Title;
		// TODO-CF: abstract field missing in example response! Using empty string for now.
		this.processOffering.process.abstractValue = "";
		this.processOffering.process.identifier = wpsResponse.ProcessOffering.Process.Identifier;
		this.processOffering.process.inputs = this.createInputs(wpsResponse.ProcessOffering.Process.Input);
		this.processOffering.process.outputs = this.createOutputs(wpsResponse.ProcessOffering.Process.Output);
		
		this.processOffering.processVersion = wpsResponse.ProcessOffering._processVersion;
		// internal format assumes array, external format is string with space-separated list -> split
		this.processOffering.jobControlOptions = wpsResponse.ProcessOffering._jobControlOptions.split(' ');
		this.processOffering.outputTransmissionModes = wpsResponse.ProcessOffering._outputTransmission.split(' ');
	},
	
	/**
	 * Takes array of outputs as given in wps-proxy response and converts it to the internal format
	 */
	createOutputs: function(outputArray) {
		var self = this;
		var formattedOutputArray = outputArray.map(function(output) {
			if(output.LiteralData) {
				return self.createLiteralDataOutputFromJson(output);
			} else if(output.ComplexData) {
				return self.createComplexDataOutputFromJson(output);
			} else if(output.Bbox) {
				return self.createBboxOutputFromJson(output);
			} else {
				return {};
			}
		});
		return formattedOutputArray;
	},
	
	/**
	 * Inputs and outputs are virtually identical, the only difference is that inputs have two additional properties: minOccurs and maxOccurs.
	 * To keep code duplication at a minimum, we therefore create the inputs as if they were outputs and then add in those additional properties.
	 */
	createInputs: function(inputArray) {
		var self = this;
		// create inputs as if they were outputs
		var formattedOutputArray = this.createOutputs(inputArray);
		
		// add in additional properties
		var formattedInputArray = formattedOutputArray.map(function(element, index) {
			element.minOccurs = inputArray[index]._minOccurs;
			element.maxOccurs = inputArray[index]._maxOccurs;
			return element;
		});
		
		return formattedInputArray;
	},
	
	/**
	 * extracts metadata that ALL inputs and outputs of ANY kind (i.e. even literal and complex data etc.) have in common UNDER THE SAME NAME
	 * (that means the formatArray is not extracted because that can be a child of LiteralData, ComplexData etc.)
	 */
	extractCommonMetadata : function(inputoroutput) {
		return {
			title : inputoroutput.Title,
			abstractValue : inputoroutput.Abstract,
			identifier : inputoroutput.Identifier,
		};
	},
	
	/**
	 * maps createFormat function to format array given by wps-proxy response
	 */
	buildFormatArray : function(format) {
		var self = this;
		return format.map(function(format) {
			return self.createFormat(format._mimeType, format._encoding, format._schema);
		});
	},
	
	createLiteralDataOutputFromJson : function(output) {
		var basic = this.extractCommonMetadata(output);
		var formatArray = this.buildFormatArray(output.LiteralData.Format);
		var literalDataDomainArray = output.LiteralData.LiteralDataDomain.map(this.createLiteralDataDomainObjectFromJson);
		return this.createLiteralDataOutput(basic.title, basic.abstractValue, basic.identifier, formatArray, literalDataDomainArray);
	},
	
	createComplexDataOutputFromJson : function(output) {
		var basic = this.extractCommonMetadata(output);
		var formatArray = this.buildFormatArray(output.ComplexData.Format);
		return this.createComplexDataOutput(basic.title, basic.abstractValue, basic.identifier, formatArray);
	},
	
	createBboxOutputFromJson : function(output) {
		var basic = this.extractCommonMetadata(output);
		// TODO-CF name of property (Bbox) guessed!
		var formatArray = this.buildFormatArray(output.Bbox.Format);
		// TODO-CF proper extraction when format is clear
		var supportedCRSs = output.Bbox.CRS;
		return this.createBboxOutput(basic.title, basic.abstractValue, basic.identifier, formatArray, supportedCRSs);
	},
	
	// actually not needed because conversion is done for the whole OutputArray at once
	/*
	createLiteralDataInputFromJson : function(input) {
		var output = createLiteralDataOutputFromJson(input);
		return this.convertOutputToInput(output, input._minOccurs, input._maxOccurs);
	},
	
	createComplexDataInputFromJson : function(input) {
		var output = createComplexDataOutputFromJson(input);
		return this.convertOutputToInput(output, input._minOccurs, input._maxOccurs);
	},
	
	createBboxInputFromJson : function(input) {
		var output = createBboxOutputFromJson(input);
		return this.convertOutputToInput(output, input._minOccurs, input._maxOccurs);
	},
	*/
	
	/**
	 * takes a LiteralDataDomain node as given by the wps-proxy response and converts it to the internal representation
	 */
	createLiteralDataDomainObjectFromJson : function(domain) {
		return this.createLiteralDataDomainObject(
				(domain.AnyValue ? 'anyValue' : (domain.allowedValues ? 'allowedValues' : 'valuesReference')),
				(domain.AnyValue ?  undefined : (domain.allowedValues ? this.createAllowedValues(domain.allowedValues) : domain.valuesReference)),
				// TODO-CF ._text part guessed!
				this.createDataTypeObject(domain.DataType._text, domain.DataType._reference),
				// TODO-CF name guessed!
				domain.DefaultValue,
				// TODO-CF name guessed!
				domain.UnitOfMeasure
			);
	},
	
	// TODO-CF code this function when proxy implemented it
	// (currently uncommented and todo'ed in proxy's code: https://github.com/52North/wps-proxy/blob/d5ad507cd1a0f8f54e3abef22ddc77b8d1e1d2d0/RestfulWPSProxy-serializer/src/main/java/org/n52/restfulwpsproxy/serializer/json/WPSProcessesJsonModule.java#L249)
	// possibly helpful for implementation: createAllowedValues function in DescribeProcessResponse_xml
	createAllowedValues : function(allowedValues_json) {
		return undefined;
	}
});