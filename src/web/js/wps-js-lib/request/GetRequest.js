
var GetRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		var targetUrl = this.settings.url;
		var targetUrlQuery = this.settings.urlQuery;
		
		//check for a query part
		if (!targetUrlQuery) {
			targetUrlQuery = this.createTargetUrlQuery();
		}
		
		if (targetUrlQuery) {
			this.settings.url = this.buildTargetUrl(targetUrl, targetUrlQuery);
		}
		
		return {
			type : "GET"
		};
	},
	
	/*
	 * overwrite this method to define specific behavior
	 */
	createTargetUrlQuery : function() {
		return null;
	},
	
	buildTargetUrl : function(targetUrl, targetUrlQuery) {
		if (targetUrl.indexOf("?") == -1) {
			targetUrl += "?";
		}
		
		if (targetUrl.indexOf("service=") == -1) {
			targetUrl += "service=WPS";
		}
		
		if (targetUrl.indexOf("version=") == -1) {
			targetUrl += "&version=" + this.settings.version;
		}
		
		if (targetUrlQuery) {
			targetUrl += "&" + targetUrlQuery;
		}
		
		return encodeURI(targetUrl);
	}

});
