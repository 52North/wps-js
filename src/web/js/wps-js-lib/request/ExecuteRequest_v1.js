/**
 * 
 */
var ExecuteRequest_v1 = ExecuteRequest.extend({

	/**
	 * will adjust the templates stored in ExecuteRequest.js file to reflect the
	 * WPS 1.0 request POST body
	 */
	overrideTemplates : function() {
		/*
		 * here not necessary, since the templates in ExecuteRequest.js are
		 * already representing WPS 1.0
		 */
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
			 * if execution mode is set to async, then we imply that response
			 * must be stored on the server and that there shall be status
			 * updates to enable status queries
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