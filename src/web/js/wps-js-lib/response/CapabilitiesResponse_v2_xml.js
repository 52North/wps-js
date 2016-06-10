var CapabilitiesResponse_v2_xml = CapabilitiesResponse.extend({
	
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
		this.capabilities.serviceProvider.providerName = xmlServiceProvider.find("ProviderName").text();
		var providerSiteNode=xmlServiceProvider.find("ProviderSite");
		this.capabilities.serviceProvider.providerSite = providerSiteNode.attr("href") || providerSiteNode.attr("xlin:href") || providerSiteNode.attr("xlink:href");
		var serviceContact = xmlServiceProvider.find("ServiceContact");
		this.capabilities.serviceProvider.serviceContact.individualName = serviceContact.find("IndividualName").text();
		var address = serviceContact.find("Address");
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = address.find("DeliveryPoint").text();
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = address.find("City").text();
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = address.find("AdministrativeArea").text();
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = address.find("postalCode").text();
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = address.find("Country").text();
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAdress = address.find("electronicMailAdress").text();
		
		/*
		 * operations
		 */
		var operationsMetadata = xmlCapabilities.find("OperationsMetadata");
		this.capabilities.operations = this.createOperationsArray(operationsMetadata.find("Operation"));
		
		/*
		 * languages
		 */
		var languages = xmlCapabilities.find("Languages");
		this.capabilities.languages = this.createArrayFromTextValues(languages.find("Language"));
		
		/*
		 * processes
		 */
		var processOffering = xmlCapabilities.find("Contents");
		this.capabilities.processes = this.createProcessesArray(processOffering.find("ProcessSummary"));
		
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
			var jobControlOutputs = xmlProcess.attr("jobControlOptions");
			var outputTransmission = xmlProcess.attr("outputTransmission");
			
			array[int] = this.createProcess(title, identifier, processVersion, jobControlOutputs, outputTransmission);
			
		}
		return array;
	}

});
