// refers to Constant.js
var defaultWpsVersion = WPS_VERSION_1_0_0;
var defaultIsRest = false;

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
		
		if (!this.settings.isRest || typeof this.settings.isRest != "boolean")
			this.settings.isRest = defaultIsRest;
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
	 * allowed values : true or false
	 * 
	 * set global variable to whether the REST binding is used or not (if not, XML will be used)
	 */
	setIsRest : function(isRest) {
		this.settings.isRest = isRest;
	},

	/**
	 * getCapabilities, per default via HTTP GET
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 * @usePOST if set to TRUE, the request will be executed via HTTP POST instead of HTTP GET
	 */
	getCapabilities : function(callbackFunction, usePOST /*only supported in ECMAScript2015: = false*/) {
		if(usePOST == undefined) usePOST = false;
		
		var capabilitiesRequest;

		if(usePOST) {
			/*
			 * TODO has to be instantiated depending on the version
			 */
			capabilitiesRequest = new GetCapabilitiesPostRequest({
				url : this.settings.url,
				version : this.settings.version
			});
		} else {
			capabilitiesRequest = new GetCapabilitiesGetRequest({
				url : this.settings.url,
				version : this.settings.version
			});
		}

		capabilitiesRequest.execute(callbackFunction);
	},

	/**
	 * process description, per default via HTTP GET
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method.
	 *                   Takes the response object as argument
	 * @processIdentifier the identifier of the process
	 * @usePOST if set to TRUE, the request will be executed via HTTP POST instead of HTTP GET
	 */
	describeProcess : function(callbackFunction, processIdentifier, usePOST /*only supported in ECMAScript2015: = false*/) {
		if(usePOST == undefined) usePOST = false;
		
		var processDescriptionRequest;

		if(usePOST) {
			processDescriptionRequest = new DescribeProcessPostRequest({
				url : this.settings.url,
				version : this.settings.version,
				processIdentifier : processIdentifier
			});
		} else {
			processDescriptionRequest = new DescribeProcessGetRequest({
				url : this.settings.url,
				version : this.settings.version,
				processIdentifier : processIdentifier
			});
		}

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