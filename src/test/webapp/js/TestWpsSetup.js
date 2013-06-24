TestCase('TestWpsSetup', {

	testShouldDefineProxy : function() {
		jQuery.wpsSetup({
			proxy : {
				url : "http://localhost:8080/jprox/parameter?targetUrl=",
				type : "parameter"
			}
		});
		assertEquals('The PROXY_URL was not as expected.',
				'http://localhost:8080/jprox/parameter?targetUrl=', PROXY_URL);
	}

});
