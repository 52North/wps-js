
/**
 * nearly all values are equal fpr WPS 1.0 and WPS 2.0. Thus most of them are hardcoded here!
 * Only some different values have to be set individually
 */
var CapabilitiesResponse_xml = CapabilitiesResponse.extend({
	
	/**
	 * @wpsResponse should be an XML v2.0.0 WPS Capabilities document
	 */
	instantiate : function(wpsResponse){
		/*
		 * set values
		 */
		
		var xmlCapabilities = $(wpsResponse).find("wps\\:Capabilities, Capabilities");
		
		/*
		 * version and service
		 */
		this.capabilities.version = xmlCapabilities.attr("version");
		this.capabilities.service = xmlCapabilities.attr("service");
		
		/*
		 * service identification
		 */
		var xmlServiceIdentification = xmlCapabilities.find("ows\\:ServiceIdentification, ServiceIdentification");
		this.capabilities.serviceIdentification.title = xmlServiceIdentification.find("ows\\:Title , Title").text();
		this.capabilities.serviceIdentification.abstractValue = xmlServiceIdentification.find("ows\\:Abstract, Abstract").text();
		this.capabilities.serviceIdentification.keywords = this.createArrayFromTextValues(xmlServiceIdentification.find("ows\\:Keyword, Keyword"));
		this.capabilities.serviceIdentification.serviceType = xmlServiceIdentification.find("ows\\:ServiceType, ServiceType").text();
		this.capabilities.serviceIdentification.serviceTypeVersions = this.createArrayFromTextValues(xmlServiceIdentification.find("ows\\:ServiceTypeVersion, ServiceTypeVersion"));
		this.capabilities.serviceIdentification.fees = xmlServiceIdentification.find("ows\\:Fees, Fees").text();
		this.capabilities.serviceIdentification.accessConstraints = xmlServiceIdentification.find("ows\\:AccessConstraints, AccessConstraints").text();
		
		/*
		 * service provider
		 */
		var xmlServiceProvider = $(xmlCapabilities).find("ows\\:ServiceProvider, ServiceProvider");
		this.capabilities.serviceProvider.providerName = xmlServiceProvider.find("ows\\:ProviderName, ProviderName").text() || undefined;
		var providerSiteNode=xmlServiceProvider.find("ows\\:ProviderSite, ProviderSite") || undefined;
		this.capabilities.serviceProvider.providerSite = providerSiteNode.attr("href") || providerSiteNode.attr("xlin\\:href") || providerSiteNode.attr("xlink\\:href") || undefined;
		var serviceContact = xmlServiceProvider.find("ows\\:ServiceContact, ServiceContact") || undefined;
		this.capabilities.serviceProvider.serviceContact.individualName = serviceContact.find("ows\\:IndividualName, IndividualName").text() || undefined;
		var address = serviceContact.find("ows\\:Address, Address");
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = address.find("ows\\:DeliveryPoint, DeliveryPoint").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = address.find("ows\\:City, City").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = address.find("ows\\:AdministrativeArea, AdministrativeArea").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = address.find("ows\\:PostalCode, PostalCode").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = address.find("ows\\:Country, Country").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = address.find("ows\\:ElectronicMailAddress, ElectronicMailAddress").text() || undefined;
		
		/*
		 * operations
		 */
		var operationsMetadata = xmlCapabilities.find("ows\\:OperationsMetadata, OperationsMetadata");
		this.capabilities.operations = this.createOperationsArray(operationsMetadata.find("ows\\:Operation, Operation"));
		
		/*
		 * languages
		 */
		var languages = this.extractAllLanguages(xmlCapabilities);
		this.capabilities.languages = this.createArrayFromTextValues(languages.find("ows\\:Language, Language"));
		
		/*
		 * processes
		 */
		var processOfferings = this.extractProcessOfferings(xmlCapabilities);
		this.capabilities.processes = this.createProcessesArray(this.extractAllProcesses(processOfferings));
	},
	
	/**
	 * extracts all languages.
	 * 
	 * Differs for each WPS version
	 */
	extractAllLanguages : function(xmlCapabilities){
		/*
		 * override in child class
		 */
	},
	
	/**
	 * extracts process offering xml node.
	 * 
	 * Differs for each WPS version
	 */
	extractProcessOfferings : function(xmlCapabilities){
		/*
		 * override in child class
		 */
		return xmlCapabilities.find("wps\\:Contents, Contents");
	},
	
	/**
	 * extracts all process  xml nodes.
	 * 
	 * Differs for each WPS version
	 */
	extractAllProcesses : function(processOfferingsXml){
		/*
		 * override in child class
		 */
	},

	createOperationsArray : function(nodes){
		var array = new Array(nodes.length);
		
		for (var int = 0; int < nodes.length; int++) {
			var xmlOperation = $(nodes[int]);
			var name = xmlOperation.attr("name");
			var getUrlNode=xmlOperation.find("ows\\:Get, Get");
			var getUrl = getUrlNode.attr("href") || getUrlNode.attr("xlin\\:href") || getUrlNode.attr("xlink\\:href");
			var PostUrlNode=xmlOperation.find("ows\\:Post, Post");
			var postUrl = PostUrlNode.attr("href") || PostUrlNode.attr("xlin\\:href") || PostUrlNode.attr("xlink\\:href");
			
			array[int] = this.createOperation(name, getUrl, postUrl);	
		}
		return array;
	},
	
	createProcessesArray : function(nodes){
		var array = new Array(nodes.length);
		
		for (var int = 0; int < nodes.length; int++) {
			var xmlProcess = $(nodes[int]);
			
			var title = xmlProcess.find("ows\\:Title, Title").text();
			var identifier = xmlProcess.find("ows\\:Identifier, Identifier").text();
			var processVersion = xmlProcess.attr("processVersion") || xmlProcess.attr("wps\\:processVersion");
			var jobControlOutputs = this.extractJobControlOptions(xmlProcess);
			var outputTransmission = this.extractOutputTransmission(xmlProcess);
			
			array[int] = this.createProcess(title, identifier, processVersion, jobControlOutputs, outputTransmission);
			
		}
		return array;
	},
	
	/**
	 * extracts jobControlOptions parameter.
	 * 
	 * Differs for each WPS version
	 */
	extractJobControlOptions : function(xmlProcess){
		/*
		 * override in child class
		 */
	},
	
	/**
	 * extracts outputTransmission parameter.
	 * 
	 * Differs for each WPS version
	 */
	extractOutputTransmission : function(xmlProcess){
		/*
		 * override in child class
		 */
	}

});
