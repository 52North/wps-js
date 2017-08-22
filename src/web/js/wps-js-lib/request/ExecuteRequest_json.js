var ExecuteRequest_json = ExecuteRequest.extend({
	createPostPayload : function() {
		var sendInputs = [];
		for(var i=0; i<this.settings.inputs.length; i++) {
			var inputitem = {};
			inputitem._id = this.settings.inputs[i].identifier;
			
			if(this.settings.inputs[i].type == 'literal') {
				inputitem.LiteralData = {
					_text : this.settings.inputs[i].value
				};
			} else if(this.settings.inputs[i].type == 'complex') {
				inputitem.ComplexData = {
					_mimeType : this.settings.inputs[i].mimeType,
					_text : this.settings.inputs[i].complexPayload
					// TODO-CF add rest (asreference, encoding etc.)
				};
			}
			// TODO-CF when implemented by the proxy: add bbox stuff
			/*else if(this.settings.inputs[i].type == 'bbox') {
				inputitem.BboxData = {
					...
				};
			}*/
			sendInputs.push(inputitem);
		}
		
		var sendOutputs = [];
		for(var i=0; i<this.settings.outputs.length; i++) {
			var outputitem = {
				_id : this.settings.outputs[i].identifier,
				_transmission : this.settings.outputs[i].transmission
			};
			
			if(this.settings.outputs[i].type == 'complex') {
				outputitem._mimeType = this.settings.outputs[i].mimeType,
				outputitem._schema = this.settings.outputs[i].schema,
				outputitem._encoding = this.settings.outputs[i].encoding
			}
			// TODO-CF when implemented by the proxy: add bbox stuff
			/*else if(this.settings.outputs[i].type == 'bbox') {
				outputitem.BboxData = {
					...
				};
			}*/
			sendOutputs.push(outputitem);
		}
		
		return JSON.stringify({
			"Execute": {
				"Identifier": this.settings.processIdentifier,
				"Input": sendInputs,
				"output": sendOutputs,
				"_response" : this.settings.responseFormat,  // TODO-CF Couldn't test responseFormat='raw' yet as the proxy only replies with an error message. Supporting responseFormat='raw' is simply not yet implemented in the proxy.
				"_service": "WPS",
				"_version": "2.0.0"
			}
		});
	},
	
	preRequestExecution : function() {
		this.settings.url += '/processes/' + this.settings.processIdentifier + '/jobs';
		if(this.settings.executionMode == 'sync')
			this.settings.url += '?sync-execute=true';
		this.settings.isRest = true;
	}
});