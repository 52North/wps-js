
var TEMPLATE_CAPABILITIES_MARKUP = '\
	<div class="wps-capabilities"> \
		<div class="wps-capabilities-serviceidentification"> \
			<ul class="wps-capabilities-list"> \
				<li class="wps-capabilities-list-entry>${service-title}<li> \
				<li class="wps-capabilities-list-entry>${service-type}<li> \
				<li class="wps-capabilities-list-entry>${service-version}<li> \
			</ul> \
		</div> \
		<div class="wps-capabilities-serviceprovider"> \
			<ul class="wps-capabilities-list"> \
				<li class="wps-capabilities-list-entry>${provider-name}<li> \
				<li class="wps-capabilities-list-entry>${provider-site}<li> \
				<li class="wps-capabilities-list-entry>${service-version}<li> \
			</ul> \
			<div class="wps-capabilities-serviceprovider-contact"> \
			</div> \
		</div> \
	</div>';

var CapabilitiesResponse = BaseResponse.extend({

	createMarkup : function() {
		var provName = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var content = "<div>Provider name: "+$(provName).text()+"</div>";
		//repeat the above to display additional information
		return content;
	}

});
