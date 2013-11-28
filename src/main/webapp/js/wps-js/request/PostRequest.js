
var PostRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		return {
			type : "POST",
			data : this.createPostPayload(),
			contentType : "text/xml"
		};
	},
	
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
