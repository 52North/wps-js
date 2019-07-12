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
		if ($(wpsResponse).find("wps\\:Result, Result").length > 0) {
			/*
			 * response/result document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "2.0.0";
			this.executeResponse.type = "resultDocument"

			this.instantiateResultDocument(wpsResponse);
		} else if ($(wpsResponse).find("wps\\:StatusInfo, StatusInfo").length > 0) {
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
			if(!(typeof wpsResponse === 'string') && ($(wpsResponse).length > 0))
				rawOutput = (new XMLSerializer()).serializeToString(wpsResponse);
			else
				rawOutput = wpsResponse;
			
			this.executeResponse.responseDocument = rawOutput;
		}
	},

	instantiateResultDocument : function(wpsResponse) {

		var result_xmlNode = $(wpsResponse).find("wps\\:Result, Result");

		var jobId = result_xmlNode.find("wps\\:JobID, JobID").text() || undefined;
		var expirationDate = result_xmlNode.find("wps\\:ExpirationDate, ExpirationDate").text()
				|| undefined;

		var outputs = this.instantiateOutputs(result_xmlNode.find("wps\\:Output, Output"));

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
			 * either element "Data" or "Reference" exists
			 */
			var reference_xmlNode = output_xmlNode.find("wps\\:Reference, Reference");
			var reference = undefined;
			if (reference_xmlNode.length > 0) {
				reference = {
					href : reference_xmlNode.attr("href")
							|| reference_xmlNode.attr("wps:href")
							|| reference_xmlNode.attr("xlin:href")
							|| reference_xmlNode.attr("xlink:href")
							|| reference_xmlNode.attr("ows:href")
							|| reference_xmlNode.attr("wps\\:href") 
							|| reference_xmlNode.attr("xlin\\:href"),
					format : reference_xmlNode.attr("mimeType") 
							|| reference_xmlNode.attr("format")
							|| undefined,
					encoding : reference_xmlNode.attr("encoding")
							|| undefined,
					schema : reference_xmlNode.attr("schema")
							|| undefined
				}

				outputs[index] = {
					identifier : output_xmlNode.attr("id"),
					reference : reference
				};
			}
			else{
				
				/*
				 * Data node;
				 * 
				 * in WPS 2.0.0 this node may either have a subnode named: 
				 * - "LiteralValue" or 
				 * - "BoundingBox" or 
				 * - directValue for
				 * complexOutput --> complex output does not have an own subNode!!!
				 */
				var data_xmlNode = output_xmlNode.find("wps\\:Data, Data");

				/*
				 * data can either be a LiteralValue or a
				 * BoundingBox element
				 */
				var data;
				var literalData_xmlNode = data_xmlNode.find("wps\\:LiteralValue, LiteralValue");
				var bboxData_xmlNode = data_xmlNode.find("ows\\:BoundingBox, BoundingBox");
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
									|| bboxData_xmlNode.find("ows\\:LowerCorner, LowerCorner").text(),
							upperCorner : bboxData_xmlNode.attr("upperCorner")
									|| bboxData_xmlNode.find("ows\\:UpperCorner, UpperCorner").text()
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
			} // end else data or reference
		} // end for

		return outputs;
	},

	instantiateStatusInfoDocument : function(wpsResponse) {
		var statusInfo_xmlNode = $(wpsResponse).find("wps\\:StatusInfo, StatusInfo");

		var jobId = statusInfo_xmlNode.find("wps\\:JobID, JobID").text();
		var status = statusInfo_xmlNode.find("wps\\:Status, Status").text();
		var expirationDate = statusInfo_xmlNode.find("wps\\:ExpirationDate, ExpirationDate").text()
				|| undefined;
		var estimatedCompletion = statusInfo_xmlNode
				.find("wps\\:EstimatedCompletion, EstimatedCompletion").text()
				|| undefined;
		var nextPoll = statusInfo_xmlNode.find("wps\\:NextPoll, NextPoll").text() || undefined;
		var percentCompleted = statusInfo_xmlNode.find("wps\\:PercentCompleted, PercentCompleted")
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