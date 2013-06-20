
var DescribeProcessRequest = BaseRequest.extend({

	processResponse : function(xml) {
		var provName = xml.getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier");
		var content = $(provName).text();
		return this._super(content);
	}

});
