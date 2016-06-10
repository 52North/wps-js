
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
		
		var xmlCapabilities = $(wpsResponse).find("Capabilities");
		
		/*
		 * version and service
		 */
		this.capabilities.version = xmlCapabilities.attr("version");
		this.capabilities.service = xmlCapabilities.attr("service");
		
		/*
		 * service identification
		 */
		var xmlServiceIdentification = xmlCapabilities.find("ServiceIdentification");
		this.capabilities.serviceIdentification.title = xmlServiceIdentification.find("Title").text();
		this.capabilities.serviceIdentification.abstractValue = xmlServiceIdentification.find("Abstract").text();
		this.capabilities.serviceIdentification.keywords = this.createArrayFromTextValues(xmlServiceIdentification.find("Keyword"));
		this.capabilities.serviceIdentification.serviceType = xmlServiceIdentification.find("ServiceType").text();
		this.capabilities.serviceIdentification.serviceTypeVersions = this.createArrayFromTextValues(xmlServiceIdentification.find("ServiceTypeVersion"));
		this.capabilities.serviceIdentification.fees = xmlServiceIdentification.find("Fees").text();
		this.capabilities.serviceIdentification.accessConstraints = xmlServiceIdentification.find("AccessConstraints").text();
		
		/*
		 * service provider
		 */
		var xmlServiceProvider = $(xmlCapabilities).find("ServiceProvider");
		this.capabilities.serviceProvider.providerName = xmlServiceProvider.find("ProviderName").text() || undefined;
		var providerSiteNode=xmlServiceProvider.find("ProviderSite") || undefined;
		this.capabilities.serviceProvider.providerSite = providerSiteNode.attr("href") || providerSiteNode.attr("xlin:href") || providerSiteNode.attr("xlink:href") || undefined;
		var serviceContact = xmlServiceProvider.find("ServiceContact") || undefined;
		this.capabilities.serviceProvider.serviceContact.individualName = serviceContact.find("IndividualName").text() || undefined;
		var address = serviceContact.find("Address");
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = address.find("DeliveryPoint").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = address.find("City").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = address.find("AdministrativeArea").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = address.find("PostalCode").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = address.find("Country").text() || undefined;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = address.find("ElectronicMailAddress").text() || undefined;
		
		/*
		 * operations
		 */
		var operationsMetadata = xmlCapabilities.find("OperationsMetadata");
		this.capabilities.operations = this.createOperationsArray(operationsMetadata.find("Operation"));
		
		/*
		 * languages
		 */
		var languages = this.extractAllLanguages(xmlCapabilities);
		this.capabilities.languages = this.createArrayFromTextValues(languages.find("Language"));
		
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
		return xmlCapabilities.find("Contents");
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
			var getUrlNode=xmlOperation.find("Get");
			var getUrl = getUrlNode.attr("href") || getUrlNode.attr("xlin:href") || getUrlNode.attr("xlink:href");
			var PostUrlNode=xmlOperation.find("Post");
			var postUrl = PostUrlNode.attr("href") || PostUrlNode.attr("xlin:href") || PostUrlNode.attr("xlink:href");
			
			array[int] = this.createOperation(name, getUrl, postUrl);	
		}
		return array;
	},
	
	createProcessesArray : function(nodes){
		var array = new Array(nodes.length);
		
		for (var int = 0; int < nodes.length; int++) {
			var xmlProcess = $(nodes[int]);
			
			var title = xmlProcess.find("Title").text();
			var identifier = xmlProcess.find("Identifier").text();
			var processVersion = xmlProcess.attr("processVersion") || xmlProcess.attr("wps:processVersion");
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
