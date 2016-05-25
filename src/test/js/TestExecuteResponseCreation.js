AsyncTestCase('TestExecuteResponseCreation', {
	
	testExecuteResponseCreation : function(queue) {
		var div = jQuery('<div />');
		var container = jQuery('<div id="test-wps-container"></div>');
		container.appendTo(div);
		var otherDiv = jQuery('<div>testbla</div>');
		otherDiv.appendTo(div);

		queue.call("Calling WPS", function(callbacks) {
			jstestdriver.console.log("Calling WPS");
			container.wpsCall({
				url : "/test/src/main/webapp/xml/ExecuteResponse_started.xml",
				requestType : EXECUTE_TYPE
			});
		});

		queue.call("Validating WPS markup", function(callbacks) {
			var validation = callbacks.add(function() {
				jstestdriver.console.log("Validating WPS markup");
				jstestdriver.console.log("Content: "+ container.html());
				var updateDiv = container
						.find('li.wps-execute-response-list-entry');

				assertNotNull(updateDiv);
				assertEquals(4, updateDiv.length);

				assertEquals("Identifier", jQuery(updateDiv[0]).children(
						"label.wps-item-label").html());
				assertEquals("org.geoviqua.geca.intercomparison", jQuery(
						updateDiv[0]).children("span.wps-item-value").html());

				assertEquals("Title", jQuery(updateDiv[1]).children(
						"label.wps-item-label").html());
				assertEquals("GECA-Intercomparison", jQuery(updateDiv[1])
						.children("span.wps-item-value").html());

				assertEquals("Created on ", jQuery(updateDiv[2]).children(
					"label.wps-item-label").html());
				assertTrue(jQuery(updateDiv[2]).children("span.wps-item-value")
						.html().indexOf("2013") !== -1);
				
				assertEquals("Status", jQuery(updateDiv[3]).children(
						"label.wps-item-label").html());
				assertTrue(jQuery(updateDiv[3]).children("span.wps-item-value")
						.html().indexOf("Process started") !== -1);


			});

			window.setTimeout(validation, 2000);
		});

	}

});
