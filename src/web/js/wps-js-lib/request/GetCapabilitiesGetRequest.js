var GetCapabilitiesGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_CAPABILITIES_TYPE;
	},

	createTargetUrlQuery : function() {
		return "request=GetCapabilities";
	}

});
