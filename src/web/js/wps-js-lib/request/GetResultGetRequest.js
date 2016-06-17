/**
 * 
 */
var GetResultGetRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_RESULT_TYPE;
	},

	createTargetUrlQuery : function() {
		var result = "request=GetResult&jobId="+this.settings.jobId;
		
		return result;
	}
	
});