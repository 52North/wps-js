var CapabilitiesResponse_v2_xml = CapabilitiesResponse_xml.extend({
	
	extractAllLanguages : function(xmlCapabilities){
		return xmlCapabilities.find("ows\\:Languages, Languages");
	},
	
	extractProcessOfferings : function(xmlCapabilities){
		return xmlCapabilities.find("wps\\:Contents, Contents");
	},
	
	extractAllProcesses : function(processOfferingsXml){
		return processOfferingsXml.find("wps\\:ProcessSummary, ProcessSummary");
	},
	
	extractJobControlOptions : function(xmlProcess){
		return xmlProcess.attr("jobControlOptions");
	},
	
	extractOutputTransmission : function(xmlProcess){
		return xmlProcess.attr("outputTransmission");
	}

});
