var BaseRequest = Class.extend({
	init : function(settings) {
		this.settings = settings;
	},

	getSettings : function() {
		return this.settings;
	},

	execute : function() {
		this.preRequestExecution();

		xmlResponse = this.executeHTTPCall();

		this.postRequestExecution();
	},

	preRequestExecution : function() {
		this.changeElementContent("<div>waiting...</div>");
	},

	postRequestExecution : function() {

	},

	processResponse : function(xml) {
		return "<div>Success!</div>";
	},

	changeElementContent : function(htmlContent) {
		this.settings.domElement.html(htmlContent);
	},

	executeHTTPCall : function() {
		var self = this;
		var jqxhr = $.get(this.settings.url, function(data){
			htmlContent = self.processResponse(data);
			self.changeElementContent(htmlContent);
		}).fail(function() {
			alert("error");
		});
	}
});
