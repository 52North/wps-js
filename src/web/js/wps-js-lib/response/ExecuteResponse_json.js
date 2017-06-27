var ExecuteResponse_json = ExecuteResponse.extend({

	instantiate : function(wpsResponse, requestObject) {
		if(requestObject.jqXhrObject.status == 201)
		{
			var locationUrl = requestObject.jqXhrObject.getResponseHeader('Location');
			if(locationUrl == null) {
				console.log("Couldn't retrieve Location header from server response. Possibly the 'Access-Control-Expose-Headers' header is missing.");
			} else {
				this.executeResponse.type = "statusInfoDocument";
				this.executeResponse.serviceVersion = "2.0.0";
				this.executeResponse.responseDocument = {
					"jobId": locationUrl.split('/').pop(),
					"status": "Accepted"
				};
			}
			// TODO-CF Other cases...
		}
	}
});