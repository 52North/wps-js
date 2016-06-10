
var PostRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		var payload = this.settings.data;
		if (!payload) {
			payload = this.createPostPayload();
		}
		
		return {
			type : "POST",
			data : payload,
			contentType : "text/xml"
		};
	},
	
	/*
	 * overwrite this method to create specific payload
	 */
	createPostPayload : function() {
		return null;
	},
	
	fillTemplate : function(template, properties) {
		return fillXMLTemplate(template, properties);
	}

});
