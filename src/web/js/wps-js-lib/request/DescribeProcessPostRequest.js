


var DescribeProcessPostRequest = PostRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = DESCRIBE_PROCESS_TYPE;
	},

	createPostPayload : function() {
		
		var DESCRIBE_PROCESS_POST = "";
		var processIdentifier = this.settings.processIdentifier;
		var serviceVersion = this.settings.version;
		
		if(serviceVersion == WPS_VERSION_1_0_0)
		 DESCRIBE_PROCESS_POST = '<DescribeProcess \
			xmlns="http://www.opengis.net/wps/1.0.0" \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS" version="1.0.0">\
			<ows:Identifier>' + processIdentifier + '</ows:Identifier>\
		</DescribeProcess>';
		
		else
			DESCRIBE_PROCESS_POST = '<DescribeProcess \
				service="WPS" \	version="' + serviceVersion +'" \
				xmlns="http://www.opengis.net/wps/2.0" \
				xmlns:ows="http://www.opengis.net/ows/2.0" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
				xsi:schemaLocation="http://www.opengis.net/wps/2.0 http://schemas.opengis.net/wps/2.0/wpsDescribeProcess.xsd">\
				<ows:Identifier>' + processIdentifier + '</ows:Identifier>\
			</DescribeProcess>';
		
		return DESCRIBE_PROCESS_POST;
	}
	
});
