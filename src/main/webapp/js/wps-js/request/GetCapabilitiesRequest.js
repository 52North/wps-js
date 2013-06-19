var GetCapabilitiesRequest = BaseRequest.extend({
	init : function(settings) {
		this._super(settings);
	},

	getSettings : function() {
		return this._super();
	},

	preRequestExecution : function() {
		return this._super();
	},
	
	processResponse : function(xml) {
		var provName = xml.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var content = "<div>"+$(provName).text()+"</div>";
		return content;
	}
});
