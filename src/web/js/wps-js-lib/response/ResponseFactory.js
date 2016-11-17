var ResponseFactory = Class.extend({

	init : function(settings) {
		this.settings = settings;
	},

	/**
	 * Since the returned documents of the WPS differ with respect to the
	 * service version, the matching result document has to be instantiated
	 * 
	 * @requestObject the request object that created the responseFactory. It is
	 *                used to resolve the response type
	 */
	resolveResponseHandler : function(wpsResponse, requestObject) {

		/*
		 * version and requestType will be compared to constant values from Constants.js
		 */
		var version = requestObject.settings.version;
		var requestType = requestObject.settings.requestType;

		if (requestType == GET_CAPABILITIES_TYPE) {
			if (version == WPS_VERSION_1_0_0)
				return new CapabilitiesResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new CapabilitiesResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == DESCRIBE_PROCESS_TYPE) {

			if (version == WPS_VERSION_1_0_0)
				return new DescribeProcessResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new DescribeProcessResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == EXECUTE_TYPE) {

			if (version == WPS_VERSION_1_0_0)
				return new ExecuteResponse_v1_xml(wpsResponse);
			else if (version == WPS_VERSION_2_0_0)
				return new ExecuteResponse_v2_xml(wpsResponse);
			else {
				return null;
			}
		} else if (requestType == GET_STATUS_TYPE) {
				return new ExecuteResponse_v2_xml(wpsResponse);

		} else if (requestType == GET_RESULT_TYPE) {
				return new ExecuteResponse_v2_xml(wpsResponse);

		}else {
			// TODO
			return new ExceptionReportResponse(wpsResponse);
		}

		return null;
	}

});
