TestCase('TestWpsSetup', {

	testShouldDefineProxyUrl : function() {
		jQuery.wpsSetup({
			proxy : {
				url : "http://localhost:8080/jprox/parameter?targetUrl=",
				type : "parameter"
			}
		});
		
		assertEquals('The PROXY_URL was not as expected.',
				'http://localhost:8080/jprox/parameter?targetUrl=', PROXY_URL);
		assertEquals('PROXY_TYPE not as expected', "parameter", PROXY_TYPE);
		
		jQuery.wpsSetup({
			reset : true
		});
	},
	
	testShouldDefineTemplates: function() {
		jQuery.wpsSetup({
			templates : {
				capabilities : "capabilities",
				processDescription : "processDescription",
				executeResponse: "executeResponse"
			}
		});
		
		assertEquals('Capabilities template not as expected.', "capabilities",
				USER_TEMPLATE_CAPABILITIES_MARKUP);
		assertEquals('ProcessDescription template not as expected.', "processDescription",
				USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP);
		assertEquals('ExecuteResponse template not as expected.', "executeResponse",
				USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP);
		
		jQuery.wpsSetup({
			reset : true
		});
	}

});
