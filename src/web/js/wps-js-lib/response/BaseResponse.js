
var BaseResponse = Class.extend({
	
	init : function(responseDocument) {
		/*
		 * represents the raw response document returned by the WPS
		 */
		this.responseDocument = responseDocument;
	},

	getRawResponseDocument : function() {
		return this.responseDocument;
	}

});
