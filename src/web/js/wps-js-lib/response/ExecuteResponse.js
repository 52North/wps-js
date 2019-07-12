var ExecuteResponse = BaseResponse.extend({

	init : function(wpsResponse) {
		this.responseDocument = wpsResponse;

		/*
		 * executeResponse can be instantiated differentely, depending on the
		 * WPS version and executionMode
		 * 
		 * Hence, we specify some common parameters, that indicate how to
		 * interpret the response
		 */
		this.executeResponse = {

			/*
			 * type shall be used to indicate the type of document
			 */
			type : "",
			serviceVersion : "",
			/*
			 * document will have varying properties as it will be instantiated
			 * differently according to the type
			 */
			responseDocument : {}
		};

		this.instantiate(wpsResponse);
	},

	instantiate : function(wpsResponse) {
		/*
		 * override this method in child classes to instantiate the object
		 */
	},

	/**
	 * will have different properties, depending on the WPS version!
	 */
	instantiateResultDocument : function() {
		this.executeResponse.resultDocument = {

		};
	},

	/**
	 * only relevant for WPS 2.0
	 */
	instantiateStatusInfoDocument : function() {

	},

});
