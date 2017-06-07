// IDEA: The API's internal format and the format the REST binding proxy provides should be identical so that it can be used directly
var CapabilitiesResponse_json = CapabilitiesResponse.extend({
	instantiate : function(wpsResponse){
		this.capabilities.service = wpsResponse.Capabilities._service;
		this.capabilities.version = wpsResponse.Capabilities._version;

		this.capabilities.serviceIdentification.title = wpsResponse.Capabilities.ServiceIdentification.Title;
		this.capabilities.serviceIdentification.abstractValue = wpsResponse.Capabilities.ServiceIdentification.Abstract;
		// TODO-CF: keywords field is not present in example response! Using empty array for now.
		this.capabilities.serviceIdentification.keywords = new Array(0);
		this.capabilities.serviceIdentification.serviceType = wpsResponse.Capabilities.ServiceIdentification.ServiceType;
		this.capabilities.serviceIdentification.serviceTypeVersions = wpsResponse.Capabilities.ServiceIdentification.ServiceTypeVersion;
		this.capabilities.serviceIdentification.fees = wpsResponse.Capabilities.ServiceIdentification.Fees;
		this.capabilities.serviceIdentification.accessConstraints = wpsResponse.Capabilities.ServiceIdentification.AccessConstraints;

		this.capabilities.serviceProvider.providerName = wpsResponse.Capabilities.ServiceProvider.ProviderName;
		this.capabilities.serviceProvider.providerSite = wpsResponse.Capabilities.ServiceProvider.ProviderSite.HRef;
		this.capabilities.serviceProvider.serviceContact.individualName = wpsResponse.Capabilities.ServiceProvider.ServiceContact.IndividualName;
		// (not only) this would be so much easier if the internal and external formats would be equal: this.capabilities.serviceProvider.serviceContact.contactInfo = wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo;
		// TODO-CF: all sub-field names of contactInfo guessed as contactInfo is an empty object in example response!!!
		// TODO-CF: contactInfo shouldn't be empty in example response! Using empty strings for now.
		this.capabilities.serviceProvider.serviceContact.contactInfo.address = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.Address;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.DeliveryPoint;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.City;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.AdministrativeArea;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.PostalCode;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.Country;
		this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = "";//wpsResponse.Capabilities.ServiceProvider.ServiceContact.ContactInfo.ElectronicalMailAddress;

		// NOTE: In the REST binding, the operations field is missing on purpose! -> Set to empty array here.
		// TODO-CF: Check if client relies on content in this array; if yes: simply always insert GET, POST (or similar)
		this.capabilities.operations = new Array(0);

		// TODO-CF: languages field is not present in example response! Using empty array for now.
		this.capabilities.languages = new Array(0);

		var self = this; // needed in anonymous function
		this.capabilities.processes = wpsResponse.Capabilities.Contents.ProcessSummaries.map(function(process) {
			return self.createProcess(process.title, process.identifier, process._processVersion, process._jobControlOptions, process._outputTransmission);
		});
	}
});
