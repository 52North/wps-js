
var CapabilitiesResponse = BaseResponse.extend({

	createMarkup : function() {
		var provName = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var content = "<div>"+$(provName).text()+"</div>";
		return content;
	}

});
