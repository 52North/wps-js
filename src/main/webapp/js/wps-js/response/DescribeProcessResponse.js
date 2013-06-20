
var TEMPLATE_PROCESS_DESCRIPTION_MARKUP = '\
	<div class="wps-process-description"> \
		<div class="wps-process-description-general"> \
			<ul class="process-description-list"> \
				<li class="wps-execute-response-list-entry>${process-identifier}<li> \
				<li class="wps-execute-response-list-entry>${process-title}<li> \
			</ul> \
		</div> \
		<div class="wps-process-description-inputs"> \
			<ul class="process-description-list"> \
				<li class="wps-execute-response-list-entry>${process-identifier}<li> \
				<li class="wps-execute-response-list-entry>${process-title}<li> \
			</ul> \
		</div> \
		<div class="wps-process-description-outputs"> \
			<ul class="process-description-list"> \
				<li class="wps-execute-response-list-entry>${process-identifier}<li> \
				<li class="wps-execute-response-list-entry>${process-title}<li> \
			</ul> \
		</div> \
	</div>';

var DescribeProcessResponse = BaseResponse.extend({

	createMarkup : function() {
		var provName = xml.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var content = "<div>"+$(provName).text()+"</div>";
		return this._super(content);
	}

});
