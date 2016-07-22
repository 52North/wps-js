/**
 * Inspects XML response of WPS 1.0 execute request
 */
var ExecuteResponse_v1_xml = ExecuteResponse
		.extend({
			instantiate : function(wpsResponse) {
				if ($(wpsResponse).find("ExecuteResponse").length > 0) {
					/*
					 * response document!
					 * 
					 * set the common response parameters
					 */
					this.executeResponse.serviceVersion = "1.0.0";
					this.executeResponse.type = "responseDocument";

					this.instantiateResponseDocument(wpsResponse);
				} else {
					/*
					 * raw output
					 */
					this.executeResponse.serviceVersion = "1.0.0";
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

			instantiateResponseDocument : function(wpsResponse) {
				var executeResponse_xmlNode = $(wpsResponse).find(
						"ExecuteResponse");

				/*
				 * service
				 */
				var service = "WPS";
				var version = "1.0.0";
				var lang = executeResponse_xmlNode.attr("lang")
						|| executeResponse_xmlNode.attr("xml:lang");
				/*
				 * statusLocation may not exist
				 */
				var statusLocation = executeResponse_xmlNode
						.attr("statusLocation")
						|| executeResponse_xmlNode.attr("wps:statusLocation")
						|| undefined;
				var serviceInstance = executeResponse_xmlNode
						.attr("serviceInstance")
						|| executeResponse_xmlNode.attr("wps:serviceInstance");

				/*
				 * process
				 */
				var process_xmlNode = executeResponse_xmlNode.find("Process");
				var processId = process_xmlNode.find("Identifier").text();
				var processTitle = process_xmlNode.find("Title").text();
				var process = {
					identifier : processId,
					title : processTitle
				};

				/*
				 * status
				 */
				var status_xmlNode = executeResponse_xmlNode.find("Status");
				var statusCreationTime = status_xmlNode.attr("creationTime")
						|| status_xmlNode.attr("wps:creationTime");
				var statusInfo = null;
				if (status_xmlNode.find("ProcessAccepted").length > 0)
					statusInfo = status_xmlNode.find("ProcessAccepted").prop(
							"tagName");
				else if (status_xmlNode.find("ProcessStarted").length > 0)
					statusInfo = status_xmlNode.find("ProcessStarted").prop(
							"tagName").concat(" - percentCompleted:").concat(
							status_xmlNode.find("ProcessStarted").attr(
									"percentCompleted"));
				else if (status_xmlNode.find("ProcessPaused").length > 0)
					statusInfo = status_xmlNode.find("ProcessPaused").prop(
							"tagName").concat(" - percentCompleted:").concat(
							status_xmlNode.find("ProcessPaused").attr(
									"percentCompleted"));
				else if (status_xmlNode.find("ProcessSucceeded").length > 0)
					statusInfo = status_xmlNode.find("ProcessSucceeded").prop(
							"tagName");
				else
					statusInfo = status_xmlNode.find("ProcessFailed").find(
							"ExceptionReport").find("ExceptionText").text()
							|| status_xmlNode.find("ProcessFailed").find(
									"ExceptionReport").attr("exceptionCode");

				var statusInfoTest = status_xmlNode.find("ProcessSucceeded")
						.text();

				var status = {
					creationTime : statusCreationTime,
					info : statusInfo
				};

				/*
				 * TODO lineage=true --> include dataInputs and outputs
				 * definitions?
				 */

				/*
				 * outputs
				 */
				var processOutputs_xmlNode = executeResponse_xmlNode
						.find("ProcessOutputs");
				var outputs_xmlNodes = processOutputs_xmlNode.find("Output");
				var outputs = this.instantiateOutputs(outputs_xmlNodes);

				/*
				 * create responseDocument
				 */
				this.executeResponse.responseDocument = {
					service : service,
					version : version,
					lang : lang,
					statusLocation : statusLocation,
					serviceInstance : serviceInstance,
					process : process,
					status : status,
					outputs : outputs
				};

			},

			instantiateOutputs : function(outputs_xmlNodes) {
				var outputs = new Array(outputs_xmlNodes.length);

				for (var index = 0; index < outputs_xmlNodes.length; index++) {
					var output_xmlNode = $(outputs_xmlNodes[index]);

					var id = output_xmlNode.find("Identifier").text();
					var title = output_xmlNode.find("Title").text();
					var abstractValue = output_xmlNode.find("Abstract").text()
							|| undefined;

					/*
					 * either element "Data" or "Reference" exists
					 */
					var reference_xmlNode = output_xmlNode.find("Reference");
					var reference = undefined;
					if (reference_xmlNode.length > 0) {
						reference = {
							href : reference_xmlNode.attr("href")
									|| reference_xmlNode.attr("wps:href"),
							format : reference_xmlNode.attr("format")
									|| undefined,
							encoding : reference_xmlNode.attr("encoding")
									|| undefined,
							schema : reference_xmlNode.attr("schema")
									|| undefined
						}

						outputs[index] = {
							identifier : id,
							title : title,
							abstractValue : abstractValue,
							reference : reference,
						};
					} else {
						/*
						 * Data element
						 */
						var data_xmlNode = output_xmlNode.find("Data");

						/*
						 * data can either be a complexData or a LiteralData or
						 * a BoundingBoxData element
						 */
						var data;
						var complexData_xmlNode = data_xmlNode
								.find("ComplexData");
						var literalData_xmlNode = data_xmlNode
								.find("LiteralData");
						var bboxData_xmlNode = data_xmlNode
								.find("BoundingBoxData");
						if (complexData_xmlNode.length > 0) {
							var data = { 
									complexData : {
										mimeType : complexData_xmlNode.attr("mimeType")
											|| undefined,
										schema : complexData_xmlNode.attr("schema")
											|| undefined,
										encoding : complexData_xmlNode.attr("encoding")
											|| undefined,
										value : complexData_xmlNode.html()
									}
								
							}
						} else if (bboxData_xmlNode.length > 0) {
							
							var data = {
									boundingBoxData : {
										crs : bboxData_xmlNode.attr("crs") || undefined,
										dimensions : bboxData_xmlNode
												.attr("dimensions")
												|| undefined,
										lowerCorner : bboxData_xmlNode
												.attr("lowerCorner")
												|| bboxData_xmlNode.find("LowerCorner")
														.text(),
										upperCorner : bboxData_xmlNode
												.attr("upperCorner")
												|| bboxData_xmlNode.find("UpperCorner")
														.text()
									}
								
							}
						} else {
							/*
							 * literalData
							 */
							var data = {
									literalData : {
										dataType : literalData_xmlNode.attr("dataType")
											|| undefined,
										uom : literalData_xmlNode.attr("uom")
											|| undefined,
										value : literalData_xmlNode.text()
									}
								
							}
						}

						outputs[index] = {
							identifier : id,
							title : title,
							abstractValue : abstractValue,
							data : data,
						};
					}

				} // end for
				return outputs;
			}
		});