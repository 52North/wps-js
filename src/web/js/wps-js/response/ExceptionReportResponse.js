var TEMPLATE_EXCEPTION_REPORT_RESPONSE_MARKUP = '\
	<div class="wps-exception-report-response"> \
		<div class="wps-exception-report-response-exceptions"> \
			<ul class="wps-exception-list" id="wps-exception-list"> \
			</ul> \
		</div> \
		<div id="wps-exception-report-response-extension"></div> \
	</div>';

var TEMPLATE_EXCEPTION_MARKUP = '\
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Code</label><span class="wps-item-error-value">${code}</span> \
	</li> \
	<li class="wps-execute-response-list-entry"> \
			<label class="wps-item-label">Text</label><span class="wps-item-error-message-value">${text}</span> \
	</li>';

var ExceptionReportResponse = BaseResponse
		.extend({

			createMarkup : function() {
				var exceptionsFromResponse = this.xmlResponse
						.getElementsByTagNameNS(OWS_11_NAMESPACE, "Exception");

				console.log("Got exception response!");
				exceptions = jQuery(exceptionsFromResponse);
				console.log(exceptions);

				var parsedExceptions = [];
				for ( var i = 0; i < exceptions.length; i++) {
					var exc = jQuery(exceptions[i]);

					var parsedExc = {
						"code" : exc.attr("exceptionCode"),
						"text" : exc.text().trim()
					};
					parsedExceptions.push(parsedExc);
				}

				var properties = {};
				var result = jQuery.tmpl(
						TEMPLATE_EXCEPTION_REPORT_RESPONSE_MARKUP, properties);
				var exceptionList = result.children('#wps-exception-list');

				// var extensionDiv = result
				// .children('#wps-exception-report-response-extension');

				// TODO FIXME display exceptions
				if (parsedExceptions && !jQuery.isEmptyObject(parsedExceptions)) {
					jQuery(parsedExceptions)
							.each(
									function(key, value) {
										alert(key + " - " + value.code + ": "
												+ value.text);
											jQuery
													.tmpl(
															TEMPLATE_EXCEPTION_MARKUP,
 															value).appendTo(
															exceptionList);
									});
				}

				return result;
			}

		});
