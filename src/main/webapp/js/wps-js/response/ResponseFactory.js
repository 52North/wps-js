
var ResponseFactory = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	resolveResponseHandler : function(xmlResponse, outputElement) {
		var rootElement = xmlResponse.documentElement;
		
		if (rootElement.tagName == "Capabilities") {
			return new CapabilitiesResponse(xmlResponse, outputElement);
		}
		else if (rootElement.tagName == "ProcessDescription") {
			return new DescribeProcessResponse(xmlResponse, outputElement);
		}
		else if (rootElement.tagName == "ExecuteResponse") {
			return new ExecuteResponse(xmlResponse, outputElement);
		}
		else if (rootElement.tagName == "ExceptionReport") {
			return new ExceptionReportResponse(xmlResponse, outputElement);
		}
		
		return null;
	}

});
