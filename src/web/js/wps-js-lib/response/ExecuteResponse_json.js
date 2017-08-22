var ExecuteResponse_json = ExecuteResponse.extend({
	
  /*
	NOTE-CF:
	The Execute command is rather complex:
	  - execution mode can be sync/async
	  - responseFormat can be raw/document
	  - inputs can be transmitted by value/reference
	  - outputs can be received by value/reference
	  - inputs can be literal/complex (or bbox, but that is not implemented yet by the server)
	  - outputs can be literal/complex (or bbox, but that is not implemented yet by the server)
	  - lineage can be true/false (although that is only relevant for WPS 1.0 and the RESTful version uses WPS 2.0 ONLY)

	In my self-written testclient (see src/web/comparison-of-classic-and-restful-responses.html), the following combinations were tested:
	  - async + document + value + value     + complex&literal + complex + false (testExec)
	  -  sync + document + value + value     + complex&literal + complex + false (testExecSync)
	  -  sync + document + value + value     +         literal + literal + false (testExecLiteralSync)
	  -  sync + document + value + reference + complex&literal + complex + false (testExecReferenceSync)

	As mentioned before, lineage is not of intereset, so it was not varied.
	Constructing input by reference was too much hassle, so it was not varied.
	Raw could not be tested because the proxy replied with error messages only (responseFormat=raw is simply not yet implemented by the server).

	Some more handy info:
	  - When using output by value, the full output data (e.g. some huge GeoJSON) is contained in the ResultDocument (may make it very large)
	  - When using output by reference, the ResultDocument will only contain a link through which the data can be obtained (may be annoying when it's only small anyways)
	  - When trying to output literal data by reference, the response is by value anyways (because having a link for nothing more than e.g. a number is pointless)
	  - Requesting with responseFormat=raw, the response will be just the result data without any ResultDocument
	  - Requesting output by reference is dominant, i.e. requesting "output by reference with responseFormat=raw" will give you a normal ResultDocument with a link to the data as if responseFormat was set to "document", ignoring the request for "raw" data.
  */

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
		
		// explicit GetStatusRequestJson request -> response is statusInfoDocument, but with a body
		} else if(requestObject.jqXhrObject.status == 200 && wpsResponse.StatusInfo) {
			this.executeResponse.type = "statusInfoDocument";
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.responseDocument = {
				"jobId": wpsResponse.StatusInfo.JobID,
				"status": wpsResponse.StatusInfo.Status
			};
		
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
		// } else if(???) { ...
		// TODO-CF: handle responseFormat=raw requests
	}
});