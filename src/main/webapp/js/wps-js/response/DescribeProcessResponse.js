
var DescribeProcessResponse = BaseResponse.extend({

	processResponse : function(xml) {
		var provName = xml.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var content = "<div>"+$(provName).text()+"</div>";
		return this._super(content);
	}

});
