
var ResponseFactory = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	resolveResponseHandler : function(xmlResponse) {
		var rootElement = xmlResponse.documentElement;
		
		if (rootElement.localName == "Capabilities") {
			return new CapabilitiesResponse(xmlResponse);
		}
		else if (rootElement.localName == "ProcessDescriptions") {
			return new DescribeProcessResponse(xmlResponse);
		}
		else if (rootElement.localName == "ExecuteResponse") {
			return new ExecuteResponse(xmlResponse);
		}
		else if (rootElement.localName == "ExceptionReport") {
			return new ExceptionReportResponse(xmlResponse);
		}
		
		return null;
	}

});
