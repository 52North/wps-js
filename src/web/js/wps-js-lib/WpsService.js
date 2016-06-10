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
	 * getCapabilities
	 * 
	 * @callbackFunction is triggered on success-event of JQuery.ajax method
	 */
	getCapabilities : function(callbackFunction) {
		var capabilitiesRequest;
		
		/*
		 * TODO has to be instantiated depending on the version
		 */
		capabilitiesRequest = new GetCapabilitiesGetRequest({
			url : this.settings.url,
			version : this.settings.version
		});

		capabilitiesRequest.execute(callbackFunction);
	},
	
	getProcessDescription : function(callbackFunction, identifier){
		var processDescriptionRequest;
		
		processDescriptionRequest = new DescribeProcessGetRequest({
			url : this.settings.url,
			version : this.settings.version,
			processIdentifier : identifier
		});
		
		processDescriptionRequest.execute(callbackFunction);
	}

});