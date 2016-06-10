
var GET_CAPABILITIES_POST = '<wps:GetCapabilities \
	xmlns:ows="http://www.opengis.net/ows/1.1" \
	xmlns:wps="http://www.opengis.net/wps/1.0.0" \
	xmlns:xlink="http://www.w3.org/1999/xlink" \
	service="WPS">\
    <wps:AcceptVersions>\
		<ows:Version>1.0.0</ows:Version>\
	</wps:AcceptVersions>\
	</wps:GetCapabilities>';


var GetCapabilitiesPostRequest = PostRequest.extend({

	createPostPayload : function() {
		return GET_CAPABILITIES_POST;
	}
	
});
