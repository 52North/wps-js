var TEMPLATE_EXECUTE_RESPONSE_MARKUP = '\
	<div class="wps-execute-response"> \
		<div class="wps-execute-response-process"> \
			<ul class="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry">${identifier}</li> \
				<li class="wps-execute-response-list-entry">${title}</li> \
			</ul> \
		</div> \
		<div class="wps-execute-response-status"> \
			<ul class="wps-execute-response-list"> \
				<li class="wps-execute-response-list-entry">${status}</li> \
				<li class="wps-execute-response-list-entry">${creationTime}</li> \
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
			else {
				var started = status[0].getElementsByTagNameNS(WPS_100_NAMESPACE, "ProcessStarted");
				var percent = started[0].getAttribute("percentCompleted");
				statusText = "Process started (" + percent + " % complete)";
			}
			
			var time = status[0].getAttribute("creationTime");	
			if (time) {
			    var d = new Date(time);
			    time = d.toLocaleString();
			}
			
			properties = {
					identifier : identifier,
					title : title,
					status : statusText,
					creationTime : time
			};
		}
		
		var result = $.tmpl(TEMPLATE_EXECUTE_RESPONSE_MARKUP, properties);
		return result;
	}

});
