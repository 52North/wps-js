
var ResponseFactory = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	resolveResponseHandler : function(xmlResponse, originalRequest) {
		var rootElement = xmlResponse.documentElement;
		
		if (rootElement.localName == "Capabilities") {
			return new CapabilitiesResponse(xmlResponse, originalRequest);
		}
		else if (rootElement.localName == "ProcessDescriptions") {
			return new DescribeProcessResponse(xmlResponse, originalRequest);
		}
		else if (rootElement.localName == "ExecuteResponse") {
			return new ExecuteResponse(xmlResponse, originalRequest);
		}
		else if (rootElement.localName == "ExceptionReport") {
			return new ExceptionReportResponse(xmlResponse, originalRequest);
		}
		
		return null;
	}

});
