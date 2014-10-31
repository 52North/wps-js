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

var TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_DOWNLOAD = '\
	<div class="wps-execute-response-result"> \
			<label class="wps-extension-item-label">${key}</label><span class="wps-item-value"><a href="${value}" title="${title}">download</a></span></li> \
	</div>';
	
var TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_IMAGE = '\
	<div class="wps-execute-response-result"> \
			<label class="wps-extension-item-label">${key}</label><br/> \
			<img src="data:${mimetype};base64, ${value}" /> \
	</div>';

var TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_VALUE = '\
	<div class="wps-execute-response-result"> \
			<label class="wps-extension-item-label">${key}</label><span class="wps-item-value" title="${title} | ${valueType}">${value}</span></li> \
	</div>';

var TEMPLATE_EXECUTE_RESPONSE_STATUS_NORMAL_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Status</label><span class="wps-item-value">${status}</span> \
	</li>';

var TEMPLATE_EXECUTE_RESPONSE_STATUS_FAILED_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Status</label><span class="wps-item-error-value">${status}</span> \
	</li> \
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Message</label><span class="wps-item-error-message-value">${message}</span> \
	</li>';

var ExecuteResponse = BaseResponse.extend({
	
	resolveProcessOutputs : function(processOutputs) {
		var outputs = processOutputs.getElementsByTagNameNS(WPS_100_NAMESPACE, "Output");
		
		var array = new Array(outputs.length);
		for (var i = 0; i < outputs.length; i++) {
			var element = outputs[i];
			var identifier = element.getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier");
			var title = element.getElementsByTagNameNS(OWS_11_NAMESPACE, "Title");
			var reference = element.getElementsByTagNameNS(WPS_100_NAMESPACE, "Reference");
			var data = element.getElementsByTagNameNS(WPS_100_NAMESPACE, "Data");
			var value;
			var valueType = null;
			if (reference && reference.length > 0) { // create link from reference
				value = reference[0].getAttribute("href");
				array[i] = {
						key : jQuery(identifier).text(),
						title: jQuery(title).text(),
						value : value,
						ref: true
				};
			}
			else {
				if(data && data.length > 0) { // show inline values
					value = "", valueType = "";
					// each data child element
					jQuery(data).children().each(function(key, val) {
						var $val = jQuery(val);
						value += $val.text();
						valueType += $val.attr("dataType");
					});
				}
				else {
					value = "n/a";
				}
				
				array[i] = {
						key : jQuery(identifier).text(),
						title: jQuery(title).text(),
						value : value,
						valueType: valueType,
						ref: false
				};
			}
		}
		
		var result = {outputs : array};
		
		return result;
	},
	
	createMarkup : function() {
		var process = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Process");
		var status = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Status");
		var reference = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Reference");
		var complexData = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "ComplexData");
		
		var mimetype = null;
		
		if(reference && reference[0]){
		    mimetype = reference[0].getAttribute('mimeType');
		}else if(complexData && complexData[0]){
		    mimetype = complexData[0].getAttribute('mimeType');		
		}
		
		var properties = null;
		var extensions = {};
		var statusText = null;
		var statusMessage = null;
		var processFailed = false;
		
		if (process && process[0] && status && status[0]) {
			var identifier = jQuery(process[0].getElementsByTagNameNS(OWS_11_NAMESPACE, "Identifier")).text();
			var title = jQuery(process[0].getElementsByTagNameNS(OWS_11_NAMESPACE, "Title")).text();	
			
			var accepted = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessAccepted");
			if (accepted && accepted.length > 0) {
				statusText = jQuery(accepted).text();
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
						extensions = jQuery.extend(this.resolveProcessOutputs(processOutputs[0]), extensions);	
					}
				}
			}
			//process failed
			if (!statusText) {
				var failed = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessFailed");
				if (failed && failed.length > 0) {
					statusText = "Process failed";
					
					exceptionText = status[0].getElementsByTagNameNS(OWS_11_NAMESPACE, "ExceptionText");
					if(exceptionText) {
						statusMessage = exceptionText.item(0).innerHTML;
						//TODO display more than one exception text
					}
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
		
		var result = jQuery.tmpl(template, properties);
		
		//insert status entry depending on normal status (started, accepted, paused, succeeded) or failed status
		var statusDiv = result.children('#wps-execute-response-status');
		var statusList = statusDiv.children('#wps-execute-response-list');
		
		statusProperties = {
			status: statusText,
			message: statusMessage
		};
		
		if(!processFailed){
			jQuery.tmpl(TEMPLATE_EXECUTE_RESPONSE_STATUS_NORMAL_MARKUP, statusProperties).appendTo(statusList);			
		}else{
			jQuery.tmpl(TEMPLATE_EXECUTE_RESPONSE_STATUS_FAILED_MARKUP, statusProperties).appendTo(statusList);
		}
		
		if (extensions && !jQuery.isEmptyObject(extensions)) {
			var extensionDiv = result.children('#wps-execute-response-extension');
			if (extensions.outputs) {
				jQuery(extensions.outputs).each(function(key, value) {
						if(value.ref == true) {
							jQuery.tmpl(TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_DOWNLOAD, value).appendTo(extensionDiv);	
						}else {
						    if(isImageMimetype(mimetype) && wps.isShowImages()){
						        //get the image from the url
			                    properties = {
			                            key : value.key,
			                		    mimetype : mimetype,
			                		    value : value.value
			                    };
			                    jQuery.tmpl(TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_IMAGE, properties).appendTo(extensionDiv);
							
						    }else{
							    jQuery.tmpl(TEMPLATE_EXECUTE_RESPONSE_EXTENSION_MARKUP_VALUE, value).appendTo(extensionDiv);					    
						    }
						}
					});
			}
		}
		
		return result;
	}

});
