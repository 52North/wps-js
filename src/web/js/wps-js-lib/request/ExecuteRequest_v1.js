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

		/*
		 * add an explicit outputStyle object
		 */

		this.settings.outputStyle = new Object();
		if (this.settings.executionMode == "async")
			this.settings.storeExecuteResponse = true;
		else
			this.settings.storeExecuteResponse = false;

		this.settings.outputStyle.lineage = false;
		if (this.settings.lineage == true)
			this.settings.outputStyle.lineage = true;

		this.settings.outputStyle.status = false;
		if (this.settings.status == true)
			this.settings.outputStyle.status = true;

	},

});