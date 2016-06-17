/**
 * Inspects XML response of WPS 1.0 execute request
 */
var ExecuteResponse_v1_xml = ExecuteResponse.extend({
	instantiate : function(wpsResponse) {
		if ($(wpsResponse).find("ExecuteResponse")) {
			/*
			 * response document!
			 * 
			 * set the common response parameters
			 */
			this.executeResponse.serviceVersion = "1.0.0";
			this.executeResponse.type = "responseDocument"

			this.instantiateResponseDocument(wpsResponse)
		} else {
			/*
			 * raw output
			 */
			this.executeResponse.serviceVersion = "1.0.0";
			this.executeResponse.type = "rawOutput"
			this.executeResponse.responseDocument = wpsResponse;
		}
	},

	instantiateResponseDocument : function(wpsResponse) {
		var executeResponse_xmlNode = $(wpsResponse).find("ExecuteResponse");

		/*
		 * service
		 */
		var service = "WPS";
		var version = "1.0.0";
		var lang = executeResponse_xmlNode.attr("lang")
				|| executeResponse_xmlNode.attr("xml:lang");
		var statusLocation = executeResponse_xmlNode.attr("statusLocation")
				|| executeResponse_xmlNode.attr("wps:statusLocation");
		var serviceInstance = executeResponse_xmlNode.attr("serviceInstance")
				|| executeResponse_xmlNode.attr("wps:serviceInstance");

		/*
		 * process
		 */
		var process_xmlNode = executeResponse_xmlNode.find("Process");
		var processId = process_xmlNode.find("Identifier").text();
		var processTitle = process_xmlNode.find("Title").text();

		/*
		 * status
		 */
		var status_xmlNode = executeResponse_xmlNode.find("Status");
		var statusCreationTime = status_xmlNode.attr("creationTime")
				|| status_xmlNode.attr("wps:creationTime");
		var statusInfo = status_xmlNode.find("ProcessAccepted").text()
				|| status_xmlNode.find("ProcessStarted").text()
				+ " percentCompleted:"
				+ status_xmlNode.find("ProcessStarted")
						.attr("percentCompleted")
				|| status_xmlNode.find("ProcessPaused").text()
				+ " percentCompleted:"
				+ status_xmlNode.find("ProcessStarted")
						.attr("percentCompleted")
				|| status_xmlNode.find("ProcessSucceeded").text()
				|| status_xmlNode.find("ProcessFailed").find("ExceptionReport")
						.find("ExceptionText").text()
				|| status_xmlNode.find("ProcessFailed").find("ExceptionReport")
						.attr("exceptionCode");

		/*
		 * TODO lineage=true --> include dataInputs and outputs definitions?
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
			service : "WPS",
			version : "1.0.0",
			lang : "",
			statusLocation : ""

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
			if (reference_xmlNode) {
				reference = {
					href : reference_xmlNode.attr("href")
							|| reference_xmlNode.attr("wps:href"),
					format : reference_xmlNode.attr("format") || undefined,
					encoding : reference_xmlNode.attr("encoding") || undefined,
					schema : reference_xmlNode.attr("schema") || undefined
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
				 * data can either be a complexData or a LiteralData or a
				 * BoundingBoxData element
				 */
				var data;
				var complexData_xmlNode = data_xmlNode.find("ComplexData");
				var literalData_xmlNode = data_xmlNode.find("LiteralData");
				var bboxData_xmlNode = data_xmlNode.find("BoundingBoxData");
				if (complexData_xmlNode) {
					var data = {
						mimeType : complexData_xmlNode.attr("mimeType")
								|| undefined,
						schema : complexData_xmlNode.attr("schema")
								|| undefined,
						encoding : complexData_xmlNode.attr("encoding")
								|| undefined,
						value : complexData_xmlNode.text()
					}
				} else if (bboxData_xmlNode) {
					var data = {
						crs : bboxData_xmlNode.attr("crs") || undefined,
						dimensions : bboxData_xmlNode.attr("dimensions")
								|| undefined,
						lowerCorner : bboxData_xmlNode.attr("lowerCorner")
								|| bboxData_xmlNode.find("lowerCorner").text(),
						upperCorner : bboxData_xmlNode.attr("upperCorner")
								|| bboxData_xmlNode.find("upperCorner").text()
					}
				} else {
					/*
					 * literalData
					 */
					var data = {
						dataType : literalData_xmlNode.attr("dataType")
								|| undefined,
						uom : literalData_xmlNode.attr("uom") || undefined,
						value : literalData_xmlNode.text()
					}
				}

				outputs[index] = {
					identifier : id,
					title : title,
					abstractValue : abstractValue,
					data : data,
				};
			}

		} //end for
		return outputs;
	}
});