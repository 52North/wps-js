var CapabilitiesResponse_v2_xml = CapabilitiesResponse_xml.extend({
	
	extractAllLanguages : function(xmlCapabilities){
		return xmlCapabilities.find("Languages");
	},
	
	extractProcessOfferings : function(xmlCapabilities){
		return xmlCapabilities.find("Contents");
	},
	
	extractAllProcesses : function(processOfferingsXml){
		return processOfferingsXml.find("ProcessSummary");
	},
	
	extractJobControlOptions : function(xmlProcess){
		return xmlProcess.attr("jobControlOptions");
	},
	
	extractOutputTransmission : function(xmlProcess){
		return xmlProcess.attr("outputTransmission");
	}

});
