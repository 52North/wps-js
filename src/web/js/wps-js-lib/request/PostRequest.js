
var PostRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		var payload = this.settings.data;
		if (!payload) {
			payload = this.createPostPayload();
		}
		
		return {
			type : "POST",
			data : payload,
			contentType : (this.settings.isRest ? "application/json" : "text/xml")
		};
	},
	
	/*
	 * overwrite this method to create specific payload
	 */
	createPostPayload : function() {
		return null;
	},
	
	fillTemplate : function(template, properties) {
		var result = template;

		for (var key in properties) {
			if (properties.hasOwnProperty(key)) {
				result = result.replace("${"+key+"}", properties[key]);
			}
		}

		return result;
	}
});
