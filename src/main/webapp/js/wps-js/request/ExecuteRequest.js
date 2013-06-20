
var ExecuteRequest = BaseRequest.extend({

	processResponse : function(xml) {
		var provName = xml.getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier");
		var content = "<div>"+$(provName).text()+"</div>";
		return this._super(content);
	}

});
