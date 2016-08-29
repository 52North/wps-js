var CapabilitiesResponse_v1_xml = CapabilitiesResponse_xml.extend({
	
	extractAllLanguages : function(xmlCapabilities){
		return xmlCapabilities.find("wps\\:Languages, Languages").find("wps\\:Supported, Supported");
	},
	
	extractProcessOfferings : function(xmlCapabilities){
		/*
		 * override in child class
		 */
		return xmlCapabilities.find("wps\\:ProcessOfferings, ProcessOfferings");
	},
	
	extractAllProcesses : function(processOfferingsXml){
		return processOfferingsXml.find("wps\\:Process, Process");
	},
	
	extractJobControlOptions : function(xmlProcess){
		/*
		 * override in child class
		 */
		return "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
	},
	
	extractOutputTransmission : function(xmlProcess){
		return "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
	}

});
