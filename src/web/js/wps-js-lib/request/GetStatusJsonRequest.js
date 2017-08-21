/**
 * 
 */
var GetStatusJsonRequest = GetRequest.extend({
	
	addRequestTypeToSettings : function() {

		// set new requestType parameter to a fixed value from Constants.js
		this.settings.requestType = GET_STATUS_TYPE;
	},

	createTargetUrlQuery : function() {
		// When invoking the getStatus_WPS_2_0 function, the end user so far has to supply only two arguments: a callback and the job-id. The process-id is not requested so far, because it is not needed by standard WPS. For the sake of a RESTful design, the REST proxy requests the url as /processes/processId/jobs/jobId. However, the current implementation doesn't care about the processId, but only takes the jobId and forwards it to the WPS (which, as mentioned before, doesn't need the processId). To refrain from adding a third argument to the function, we'll therefore simply use "dummyprocess" as the process in the requested URL. Not exactly neat, but the easiest way.
		var result = "/processes/dummyprocess/jobs/"+this.settings.jobId;
		
		return result;
	}
	
});
