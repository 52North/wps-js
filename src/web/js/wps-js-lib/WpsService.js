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
		 * @callbackFunction is triggered on success-event of JQuery.ajax method. 
		 * Takes the response object as argument
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
	 * Takes the response object as argument
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
	 * Takes the response object as argument
	 */
	describeProcess_GET : function(callbackFunction, identifier){
		var processDescriptionRequest;
		
		processDescriptionRequest = new DescribeProcessGetRequest({
			url : this.settings.url,
			version : this.settings.version,
			processIdentifier : identifier
		});
		
		processDescriptionRequest.execute(callbackFunction);
	},
	
	/**
	 * process description via HTTP POST
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method. 
	 * Takes the response object as argument
	 */
	describeProcess_POST : function(callbackFunction, identifier){
		var processDescriptionRequest;
		
		processDescriptionRequest = new DescribeProcessPostRequest({
			url : this.settings.url,
			version : this.settings.version,
			processIdentifier : identifier
		});
		
		processDescriptionRequest.execute(callbackFunction);
	}

});