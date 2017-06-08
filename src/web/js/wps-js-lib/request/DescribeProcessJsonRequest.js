var DescribeProcessJsonRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {
		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = DESCRIBE_PROCESS_TYPE;
	},

	createTargetUrlQuery : function() {
		return "/processes/" + this.settings.processIdentifier;
	}
	
});
