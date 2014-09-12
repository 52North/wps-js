
var WPSConfiguration = Class.extend({
	
	init : function(settings) {
		this.settings = settings;
	},
	
	getServiceUrl : function() {
		return this.settings.url;
	},
	
	isShowImages : function() {
		return this.settings.showImages;
	}

});
