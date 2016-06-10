


var DescribeProcessPostRequest = PostRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = DESCRIBE_PROCESS_TYPE;
	},

	createPostPayload : function() {
		
		var processIdentifier = this.settings.processIdentifier;
		
		var DESCRIBE_PROCESS_POST = '<DescribeProcess \
			xmlns="http://www.opengis.net/wps/1.0.0" \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS" version="1.0.0">\
			<ows:Identifier>' + processIdentifier + '</ows:Identifier>\
		</DescribeProcess>';
		
		return DESCRIBE_PROCESS_POST;
	}
	
});
