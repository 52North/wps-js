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

			/*
			 * check whether response is an XML document. 
			 * In that case return the xmlString, 
			 * else return the response directly
			 */
			var rawOutput;
			if($(wpsResponse).length > 0)
				rawOutput = (new XMLSerializer()).serializeToString(wpsResponse);
			else
				rawOutput = wpsResponse;
			
			this.executeResponse.responseDocument = rawOutput;
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

			/*
			 * Data node;
			 * 
			 * in WPS 2.0.0 this node may either have a subnode named: 
			 * - "LiteralValue" or 
			 * - "BoundingBox" or 
			 * - directValue for
			 * complexOutput --> complex output does not have an own subNode!!!
			 */
			var data_xmlNode = output_xmlNode.find("Data");

			/*
			 * data can either be a LiteralValue or a
			 * BoundingBox element
			 */
			var data;
			var literalData_xmlNode = data_xmlNode.find("LiteralValue");
			var bboxData_xmlNode = data_xmlNode.find("BoundingBox");
			if (literalData_xmlNode.length > 0) {
				
				/*
				 * literalData
				 */
				data = {
					literalData : {
						dataType : literalData_xmlNode.attr("dataType")
								|| undefined,
						uom : literalData_xmlNode.attr("uom") || undefined,
						value : literalData_xmlNode.text()
					}

				}
				
				
			} else if (bboxData_xmlNode.length > 0) {

				data = {
					boundingBoxData : {
						crs : bboxData_xmlNode.attr("crs") || undefined,
						dimensions : bboxData_xmlNode.attr("dimensions")
								|| undefined,
						lowerCorner : bboxData_xmlNode.attr("lowerCorner")
								|| bboxData_xmlNode.find("LowerCorner").text(),
						upperCorner : bboxData_xmlNode.attr("upperCorner")
								|| bboxData_xmlNode.find("UpperCorner").text()
					}

				}
			} else {
				/*
				 * complex data
				 */
				data = {
						complexData : {
							mimeType : data_xmlNode.attr("mimeType")
									|| undefined,
							schema : data_xmlNode.attr("schema")
									|| undefined,
							encoding : data_xmlNode.attr("encoding")
									|| undefined,
							value : data_xmlNode.html()
						}

					}
			}

			/*
			 * TODO nested Output!
			 */

			outputs[index] = {
				identifier : output_xmlNode.attr("id"),
				data : data
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