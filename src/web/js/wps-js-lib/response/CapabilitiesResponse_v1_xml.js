var CapabilitiesResponse_v1_xml = CapabilitiesResponse.extend({
	
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
		var languages_supported = xmlCapabilities.find("Languages").find("Supported");
		this.capabilities.languages = this.createArrayFromTextValues(languages_supported.find("Language"));
		
		/*
		 * processes
		 */
		var processOffering = xmlCapabilities.find("ProcessOfferings");
		this.capabilities.processes = this.createProcessesArray(processOffering.find("Process"));
		
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
			//TODO how to initiate those two?
			var jobControlOutputs = "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
			var outputTransmission = "For WPS 1.0 please execute a DescribeProcess request with this process identifier. This parameter will be included in the returned process description!";
			
			array[int] = this.createProcess(title, identifier, processVersion, jobControlOutputs, outputTransmission);
			
		}
		return array;
	}

});
