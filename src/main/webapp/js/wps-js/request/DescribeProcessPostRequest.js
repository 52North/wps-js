
var DESCRIBE_PROCESS_POST = '<DescribeProcess \
	xmlns="http://www.opengis.net/wps/1.0.0" \
	xmlns:ows="http://www.opengis.net/ows/1.1" \
	xmlns:xlink="http://www.w3.org/1999/xlink" \
	service="WPS" version="1.0.0">\
	${identifierList}\
</DescribeProcess>';

var DESCRIBE_PROCESS_POST_IDENTIFIER = '<ows:Identifier>${identifier}</ows:Identifier>';


var DescribeProcessPostRequest = PostRequest.extend({

	createPostPayload : function() {
		
		var processIdentifier = this.settings.processIdentifier;
		
		var idList = "";
		if (processIdentifier) {
			if (jQuery.isArray(processIdentifier)) {
				for (var i = 0; i < processIdentifier.length; i++) {
					idList += this.fillTemplate(DESCRIBE_PROCESS_POST_IDENTIFIER, {identifier: processIdentifier[i]});
				}
			}
			else {
				idList = this.fillTemplate(DESCRIBE_PROCESS_POST_IDENTIFIER, {identifier: processIdentifier});
			}
		}
		
		return this.fillTemplate(DESCRIBE_PROCESS_POST, {identifierList: idList});
	}
	
});
