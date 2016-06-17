/**
 * Inspects XML response of WPS 2.0 execute request
 */
var ExecuteResponse_v2_xml = ExecuteResponse.extend({

	instantiate : function(wpsResponse) {
		/*
		 * TODO WPS 2.0 specifies different response possibilities
		 * 
		 * raw data
		 * 
		 * StatusInfo document
		 * 
		 * Response/Result Document
		 * 
		 * Hence, we must implement each possibility and return an appropriate
		 * response
		 */
		if ($(wpsResponse).find("Result").length > 0) {
			/*
			 * response/result document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "resultDocument"

			this.instantiateResultDocument(wpsResponse);
		} else if ($(wpsResponse).find("StatusInfo").length > 0) {
			/*
			 * response/result document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "statusInfoDocument";

			this.instantiateStatusInfoDocument(wpsResponse);
		} else {
			/*
			 * raw output
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "rawOutput";
			this.executeResponse.responseDocument = wpsResponse;
		}
	},

	instantiateResultDocument : function(wpsResponse) {

		var result_xmlNode = $(wpsResponse).find("Result");

		var jobId = result_xmlNode.find("JobID").text() || undefined;
		var expirationDate = result_xmlNode.find("ExpirationDate").text()
				|| undefined;

		var outputs = this.instantiateOutputs(result_xmlNode.find("Output"));

		this.executeResponse.responseDocument = {
			jobId : jobId,
			expirationDate : expirationDate,
			outputs : outputs
		};
	},

	instantiateOutputs : function(outputs_xmlNodes) {
		var outputs = new Array(outputs_xmlNodes.length);

		for (var index = 0; index < outputs_xmlNodes.length; index++) {
			var output_xmlNode = $(outputs_xmlNodes[index]);
			var data_xmlNode = output_xmlNode.find("Data");

			/*
			 * TODO nested Output!
			 */

			outputs[index] = {
				identifier : output_xmlNode.attr("id"),
				data : {
					mimeType : data_xmlNode.attr("mimeType") || undefined,
					schema : data_xmlNode.attr("schema") || undefined,
					encoding : data_xmlNode.attr("encoding") || undefined,
					value : data_xmlNode.html()
				}
			};
		}
		
		return outputs;
	},

	instantiateStatusInfoDocument : function(wpsResponse) {
		var statusInfo_xmlNode = $(wpsResponse).find("StatusInfo");

		var jobId = statusInfo_xmlNode.find("JobID").text();
		var status = statusInfo_xmlNode.find("Status").text();
		var expirationDate = statusInfo_xmlNode.find("ExpirationDate").text()
				|| undefined;
		var estimatedCompletion = statusInfo_xmlNode
				.find("EstimatedCompletion").text()
				|| undefined;
		var nextPoll = statusInfo_xmlNode.find("NextPoll").text() || undefined;
		var percentCompleted = statusInfo_xmlNode.find("PercentCompleted")
				.text()
				|| undefined;

		this.executeResponse.responseDocument = {
			jobId : jobId,
			status : status,
			expirationDate : expirationDate,
			estimatedCompletion : estimatedCompletion,
			nextPoll : nextPoll,
			percentCompleted : percentCompleted
		};
	}

});