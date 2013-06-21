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
		<div class="wps-execute-response-status"> \
			<ul class="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-item-label">Status</label><span class="wps-item-value">${status}</span></li> \
				<li class="wps-execute-response-list-entry"> \
					<label class="wps-item-label">Created on </label><span class="wps-item-value">${creationTime}</span></li> \
			</ul> \
		</div> \
	</div>';


var ExecuteResponse = BaseResponse.extend({

	createMarkup : function() {
		var process = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Process");
		var status = this.xmlResponse.getElementsByTagNameNS(WPS_100_NAMESPACE, "Status");
		
		var properties;
		
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
			if (!statusText) {
				var succeeded = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessSucceeded");
				if (succeeded && succeeded.length > 0) {
					statusText = "Process succeeded";
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
					status : statusText,
					creationTime : time,
					updateSwitchEnabled : updateSwitch
			};
		}
		
		var statusLocation = this.xmlResponse.documentElement.getAttribute("statusLocation");
		/*
		 * Make this updateable and NOT execute two times.
		 */
		if (statusLocation) {
			var factory = new ResponseFactory();
			this.originalRequest.settings.url = statusLocation;
			this.originalRequest = new GetRequest(this.originalRequest.settings);
		}
		
		var result = $.tmpl(TEMPLATE_EXECUTE_RESPONSE_MARKUP, properties);
		return result;
	}

});
