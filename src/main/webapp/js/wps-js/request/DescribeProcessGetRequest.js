
var DescribeProcessGetRequest = GetRequest.extend({

	createTargetUrlQuery : function() {
		var result = "request=DescribeProcess&identifier="+this.settings.processIdentifier;
		
		return result;
	}
	
});
