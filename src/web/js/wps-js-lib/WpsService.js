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

		if (!this.settings.version)
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
	 * @inputs an array of needed Input objects with structure: {id:identifier, type:literal|complex|bbox
	 *         mimeType:mimeTypeValue, encoding:encodingValue,
	 *         schema:schemaValue}
	 *         
	 *         {id:identifier,
	 *         Data|Reference|Input}, where Data has structure
	 *         {mimeType:mimeTypeValue, encoding:encodingValue,
	 *         schema:schemaValue, data:dataValue} and reference has structure
	 *         {mimeType:mimeTypeValue, encoding:encodingValue,
	 *         schema:schemaValue, href:hrefValue,
	 *         postRequestBody:PostRequestBody}, where PostRequestBody has
	 *         structure {postBody:fullBodyValue |
	 *         postBodyReference:urlToBodyValue}
	 * @outputs an array of requested Output objects, where Output has structure
	 *          {mimeType:mimeTypeValue, encoding:encodingValue,
	 *          schema:schemaValue, transmission:value|reference, id:identifier,
	 *          Output}
	 */
	execute : function(callbackFunction, processIdentifier, responseFormat,
			executionMode, lineage, inputs, outputs) {
		var executeRequest;
		
		if (this.settings.version == Constants.WPS_VERSION_1_0_0){
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

		else{
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

});