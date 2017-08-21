/**
 * 
 */
var GetResultJsonRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_RESULT_TYPE;
	},

	createTargetUrlQuery : function() {
		console.log(this.settings);
		// see GetStatusJsonRequest.js for explanation of why we use dummyprocess
		var result = "/processes/dummyprocess/jobs/"+this.settings.jobId+"/outputs?format=json";
		
		return result;
	}
	
});
