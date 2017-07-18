var ExecuteResponse_json = ExecuteResponse.extend({

	instantiate : function(wpsResponse, requestObject) {
		// async -> response is statusInfoDocument
		if(requestObject.jqXhrObject.status == 201)
		{
			// structure always identical: no body, just the Location header that points to the resultDocument
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
		
		// sync -> response is resultDocument
		} else if(requestObject.jqXhrObject.status == 200) {
			this.executeResponse.type = "resultDocument";
			this.executeResponse.serviceVersion = "2.0.0";
			// structure depends on the process (literal/complex data) and its execution (value/reference transmission)
			this.executeResponse.responseDocument = {
				"jobId": wpsResponse.Result.JobID,
				"outputs": wpsResponse.Result.Output.map(function(e) {
					// always identical: the ID
					var result = {identifier: e.ID};
					// rest depends
					if(e.ComplexData) {
						result.data = {complexData: {mimeType: e.ComplexData._mimeType, value: e.ComplexData._text}};
					} else if(e.LiteralData) {
						result.data = {literalData: {value: e.LiteralData._text}};
					} else if (e.Reference) {
						result.reference = {href: e.Reference._href, format: e.Reference._mimeType };
					}
					
					return result;
				})
			};
		}
		
		// raw -> response is rawOutput
		// TODO-CF: handle responseFormat=raw requests
	}
});