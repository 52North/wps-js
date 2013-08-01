var TEMPLATE_EXECUTE_RESPONSE_MARKUP = '\
	<div class="wps-execute-response"> \
	<div class="wps-execute-autoUpdate" id="wps-execute-autoUpdate" style="${updateSwitchEnabled}"></div> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-item-label">Identifier</label><span class="wps-item-value">${identifier}</span></li> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-item-label">Title</label><span class="wps-item-value">${title}</span></li> \
			</ul> \
		</div> \
		<div class="wps-execute-response-status" id="wps-execute-response-status"> \
			<ul class="wps-execute-response-list" id="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-item-label">Created on </label><span class="wps-item-value">${creationTime}</span></li> \
			</ul> \
		</div> \
		<div id="wps-execute-response-extension"></div> \
	</div>';

var TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP = '\
	<div> \
			<label class="wps-extension-item-label">${key}</label><span class="wps-item-value"><a href="${value}">download</a></span></li> \
	</div>';

var TEMPLATE_EXECUTE_RESPONSE_STATUS_NORMAL_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Status</label><span class="wps-item-value">${status}</span> \
	</li>';

//TODO add functionalities to show exception
var TEMPLATE_EXECUTE_RESPONSE_STATUS_FAILED_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Status</label><span class="wps-item-error-value">${status}</span> \
	</li>';

var ExecuteResponse = BaseResponse.extend({
	
	resolveProcessOutputs : function(processOutputs) {
		var outputs = processOutputs.getElementsByTagNameNS(WPS_100_NAMESPACE, "Output");
		
		var array = new Array(outputs.length);
		for (var i = 0; i < outputs.length; i++) {
			var element = outputs[i];
			var identifier = element.getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier");
			var reference = element.getElementsByTagNameNS(WPS_100_NAMESPACE, "Reference");
			var value;
			if (reference && reference.length > 0) {
				value = reference[0].getAttribute("href");
			}
			else {
				value = "n/a";
			}
			array[i] = {
					key : $(identifier).text(),
					value : value
			};
		}
		
		var result = {outputs : array};
		
		return result;
	},
	
	createMarkup : function() {
		var process = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Process");
		var status = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Status");
		
		var properties;
		var extensions = {};
		
		var processFailed = false;
		
		if (process && process[0] && status && status[0]) {
			var identifier = $(process[0].getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier")).text();
			var title = $(process[0].getElementsByTagNameNS(OWS_11_NAMESPACE, "Title")).text();	
			
			var statusText;
			
			var accepted = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessAccepted");
			if (accepted && accepted.length > 0) {
				statusText = $(accepted).text();
			}
			if (!statusText) {
				var started = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessStarted");
				if (started && started.length > 0) {
					var percent = started[0].getAttribute("percentCompleted");
					statusText = "Process started (" + percent + " % complete)";	
				}
			}
			//process paused
			if (!statusText) {
				var paused = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessPaused");
				if (paused && paused.length > 0) {
					statusText = "Process paused";
				}
			}
			if (!statusText) {
				var succeeded = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessSucceeded");
				if (succeeded && succeeded.length > 0) {
					statusText = "Process succeeded";
					var processOutputs = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessOutputs");
					if (processOutputs && processOutputs.length > 0) {
						extensions = $.extend(this.resolveProcessOutputs(processOutputs[0]), extensions);	
					}
				}
			}
			//process failed
			if (!statusText) {
				var failed = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessFailed");
				if (failed && failed.length > 0) {
					statusText = "Process failed";
					//TODO display exception text
					processFailed = true;
				}
			}
			
			var time = status[0].getAttribute("creationTime");	
			if (time) {
			    var d = new Date(time);
			    time = d.toLocaleString();
			}
			
			var updateSwitch;
			if (this.originalRequest.updateSwitch) {
				updateSwitch = '';
			}
			else {
				updateSwitch = 'display:none';
			}
			
			properties = {
					identifier : identifier,
					title : title,
					creationTime : time,
					updateSwitchEnabled : updateSwitch
			};
		}
		
		var statusLocation = this.xmlResponse.documentElement.getAttribute("statusLocation");
		/*
		 * Make this updateable and NOT execute two times.
		 */
		if (statusLocation) {
			this.originalRequest.settings.url = statusLocation;
			//this.originalRequest = new GetRequest(this.originalRequest.settings);
			
			var getSettings = {
				url : this.originalRequest.settings.url,
				requestType : this.originalRequest.settings.requestType,
				type : "GET" 
			};
			
			this.originalRequest = new GetRequest(getSettings);
		}
		
		var template;
		if (USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP != null) {
			template = USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP;
		}
		else {
			template = TEMPLATE_EXECUTE_RESPONSE_MARKUP;
		}
		
		var result = $.tmpl(template, properties);
		
		//insert status entry depending on normal status (started, accepted, paused, succeeded) or failed status
		var statusDiv = result.children('#wps-execute-response-status');
		var statusList = statusDiv.children('#wps-execute-response-list');
		
		statusProperties = {
			status: statusText
		};
		
		if(!processFailed){
			$.tmpl(TEMPLATE_EXECUTE_RESPONSE_STATUS_NORMAL_MARKUP, statusProperties).appendTo(statusList);			
		}else{
			$.tmpl(TEMPLATE_EXECUTE_RESPONSE_STATUS_FAILED_MARKUP, statusProperties).appendTo(statusList);
		}
		
		if (extensions && !$.isEmptyObject(extensions)) {
			var extensionDiv = result.children('#wps-execute-response-extension');
			if (extensions.outputs) {
				$.tmpl(TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP, extensions.outputs).appendTo(extensionDiv);
			}
		}
		
		return result;
	}

});
