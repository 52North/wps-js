

var GetCapabilitiesPostRequest = PostRequest.extend({

	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_CAPABILITIES_TYPE;
	},
	
	createPostPayload : function() {
		var GET_CAPABILITIES_POST = '<wps:GetCapabilities \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:wps="http://www.opengis.net/wps/1.0.0" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS">\
		    <wps:AcceptVersions>\
				<ows:Version>' + this.settings.version + '</ows:Version>\
			</wps:AcceptVersions>\
			</wps:GetCapabilities>';
		
		return GET_CAPABILITIES_POST;
	}
	
});
