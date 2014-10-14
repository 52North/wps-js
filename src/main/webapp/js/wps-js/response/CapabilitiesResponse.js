
var TEMPLATE_CAPABILITIES_MARKUP = '\
	<div class="wps-capabilities"> \
		<div class="wps-capabilities-serviceidentification"> \
			<ul class="wps-capabilities-list"> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Title</label><span class="wps-item-value">${serviceTitle}</span></li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Abstract</label><span class="wps-item-value">${serviceAbstract}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Keywords</label><span class="wps-item-value">${serviceKeywords}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Type</label><span class="wps-item-value">${serviceType}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Version</label><span class="wps-item-value">${serviceVersion}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Fees</label><span class="wps-item-value">${serviceFees}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Access constraints</label><span class="wps-item-value">${serviceAccessConstraints}</li> \
			</ul> \
		</div> \
		<div class="wps-capabilities-serviceprovider"> \
			<ul class="wps-capabilities-list"> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Provider name</label><span class="wps-item-value">${providerName}</li> \
				<li class="wps-capabilities-list-entry"> \
					<label class="wps-item-label">Provider site</label><span class="wps-item-value"><a href="${providerSite}" target="_blank" title="Open link in new window">${providerSite}</a></li> \
			</ul> \
			<div class="wps-capabilities-serviceprovider-contact"> \
		</div> \
		<div class="wps-capabilities-full-link"> \
			<a href="${capabilitiesFullLink}" title="Show original capabilities document in a new window" target="_blank">Full capabilities</a> \
		</div> \
	</div>';

var CapabilitiesResponse = BaseResponse.extend({

	createMarkup : function() {
		var ident = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ServiceIdentification");
		var identTitle = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "Title")[0];
		var identAbstract = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "Abstract")[0];
		var identKeywords = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "Keyword");
		var keywords = "";
		jQuery.each(identKeywords, function(index, value) {
			keywords += jQuery(value).text() + " ";
		});
		
		var identType = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ServiceType");
		var identVersion = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ServiceTypeVersion");
		var identFees = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "Fees");
		var identAccessConstr = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "AccessConstraints");
		
		var provName = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderName");
		var provSite = this.xmlResponse.getElementsByTagNameNS(OWS_11_NAMESPACE, "ProviderSite");
		var site = jQuery(provSite).attr("xlink:href");
		
		capabilitiesProperties = {
				serviceTitle: jQuery(identTitle).text(),
				serviceAbstract: jQuery(identAbstract).text(),
				serviceKeywords: keywords,
				serviceType: jQuery(identType).text(),
				serviceVersion: jQuery(identVersion).text(),
				serviceFees: jQuery(identFees).text(),
				serviceAccessConstraints: jQuery(identAccessConstr).text(),
				providerName: jQuery(provName).text(),
				providerSite: site,
				capabilitiesFullLink: this.originalRequest.settings.url
		};
		
		var content = jQuery.tmpl(TEMPLATE_CAPABILITIES_MARKUP, capabilitiesProperties);
		
		return content;
	}

});
