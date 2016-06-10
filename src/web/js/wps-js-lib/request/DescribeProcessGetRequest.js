
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
