
var PostRequest = BaseRequest.extend({

	prepareHTTPRequest : function() {
		return {
			type : "POST",
			data : this.settings.data
		};
	}

});
