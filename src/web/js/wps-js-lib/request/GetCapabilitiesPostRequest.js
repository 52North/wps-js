

var GetCapabilitiesPostRequest = PostRequest.extend({

	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_CAPABILITIES_TYPE;
	},
	
	createPostPayload : function() {
		var GET_CAPABILITIES_POST = "";
		
		var serviceVersion = this.settings.version;
		
		if(serviceVersion == WPS_VERSION_1_0_0)
			GET_CAPABILITIES_POST = '<wps:GetCapabilities \
			xmlns:ows="http://www.opengis.net/ows/1.1" \
			xmlns:wps="http://www.opengis.net/wps/1.0.0" \
			xmlns:xlink="http://www.w3.org/1999/xlink" \
			service="WPS">\
		    <wps:AcceptVersions>\
				<ows:Version>' + serviceVersion + '</ows:Version>\
			</wps:AcceptVersions>\
			</wps:GetCapabilities>';
		
		else{
			GET_CAPABILITIES_POST = '<wps:GetCapabilities \
				service="WPS" \
				xmlns:ows="http://www.opengis.net/ows/2.0" \
				xmlns:wps="http://www.opengis.net/wps/2.0" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
				xsi:schemaLocation="http://www.opengis.net/wps/2.0 http://schemas.opengis.net/wps/2.0/wpsGetCapabilities.xsd"> \
				</wps:GetCapabilities>';
		}
		
		return GET_CAPABILITIES_POST;
	}
	
});
