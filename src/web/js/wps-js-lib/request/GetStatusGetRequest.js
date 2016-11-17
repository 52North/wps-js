/**
 * 
 */
var GetStatusGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_STATUS_TYPE;
	},

	createTargetUrlQuery : function() {
		var result = "request=GetStatus&jobId="+this.settings.jobId;
		
		return result;
	}
	
});