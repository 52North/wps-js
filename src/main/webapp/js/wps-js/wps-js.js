
function resolveRequest(type, settings) {
	if (type == GET_CAPABILITIES_TYPE) {
		return new GetCapabilitiesRequest(settings);
	}
	else if (type == DESCRIBE_PROCESS_TYPE) {
		return new BaseRequest(settings);
	}
}

(function($) {

    $.fn.wpsCall = function( options ) {

        // Establish our default settings
        var settings = $.extend({
            requestType: GET_CAPABILITIES_TYPE,
            method: "GET",
            content: null
        }, options);

        return this.each( function() {
        	var requestSettings = $.extend({
                domElement: $(this)
            }, settings);
        	
        	var request = resolveRequest(requestSettings.requestType, requestSettings);
        	request.execute();
        });

    }

}(jQuery));
