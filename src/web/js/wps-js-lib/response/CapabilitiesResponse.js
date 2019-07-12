var CapabilitiesResponse = BaseResponse
		.extend({

			/*
			 * {  
   "capabilities":{  
      "serviceIdentification":{  
         "title":"52°North WPS 3.3.2-SNAPSHOT",
         "abstractValue":"Service based on the 52°North implementation of WPS 1.0.0",
         "keywords":[  
            "WPS",
            "geospatial",
            "geoprocessing"
         ],
         "serviceType":"WPS",
         "serviceTypeVersions":[
         	"ServiceTypeVersion":"1.0.0"
         	]
         "fees":"NONE",
         "accessConstraints":"NONE"
      },
      "serviceProvider":{  
         "providerName":"52North",
         "providerSite":"http://www.52north.org/",
         "serviceContact":{  
            "individualName":"",
            "contactInfo":{  
               "address":{  
                  "deliveryPoint":"",
                  "city":"",
                  "administrativeArea":"",
                  "postalCode":"",
                  "country":"",
                  "electronicMailAddress":""
               }
            }
         }
      },
      "operations":[  
         {  
            "DCP":{  
               "HTTP":{  
                  "get":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService?",
                  "post":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService"
               }
            },
            "name":"GetCapabilities"
         },
         {  
            "DCP":{  
               "HTTP":{  
                  "get":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService?",
                  "post":"http://geostatistics.demo.52north.org:80/wps/WebProcessingService"
               }
            },
            "name":"DescribeProcess"
         }
      ],
      "processes":[  
         {  
            "title":"org.n52.wps.server.algorithm.CSWLoDEnablerStarter",
            "identifier":"org.n52.wps.server.algorithm.CSWLoDEnablerStarter",
            "processVersion":"1.1.0",
            "jobControlOptions":"sync-execute async-execute",
            "outputTransmission":"value reference"
         },
         {  
            "title":"org.n52.wps.server.algorithm.JTSConvexHullAlgorithm",
            "identifier":"org.n52.wps.server.algorithm.JTSConvexHullAlgorithm",
            "processVersion":"1.1.0",
            "jobControlOptions":"sync-execute async-execute",
            "outputTransmission":"value reference"
         }
      ],
      "service":"WPS",
      "version":"2.0.0"
   }
}
			 */

			init : function(wpsResponse) {
				this.responseDocument = wpsResponse;
				
				/*
				 * create an empty new instance of capabilities object
				 */

				this.capabilities = new Object();

				/*
				 * service and version
				 */
				this.capabilities.service = "WPS";
				this.capabilities.version = "";

				/*
				 * service identification
				 */
				this.capabilities.serviceIdentification = new Object();
				this.capabilities.serviceIdentification.title = "";
				this.capabilities.serviceIdentification.abstractValue = "";
				this.capabilities.serviceIdentification.keywords = new Array;
				this.capabilities.serviceIdentification.serviceType = "WPS";
				this.capabilities.serviceIdentification.serviceTypeVersions = new Array;
				this.capabilities.serviceIdentification.fees = "";
				this.capabilities.serviceIdentification.accessConstraints = "";

				/*
				 * service provider
				 */
				this.capabilities.serviceProvider = new Object();
				this.capabilities.serviceProvider.providerName = "";
				this.capabilities.serviceProvider.providerSite = "";
				this.capabilities.serviceProvider.serviceContact = new Object();
				this.capabilities.serviceProvider.serviceContact.individualName = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo = new Object();
				this.capabilities.serviceProvider.serviceContact.contactInfo.address = new Object();
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.deliveryPoint = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.city = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.administrativeArea = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.postalCode = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.country = "";
				this.capabilities.serviceProvider.serviceContact.contactInfo.address.electronicMailAddress = "";

				/*
				 * operations with one dummy entry
				 */
				this.capabilities.operations = new Array(1);
				this.capabilities.operations[0] = this.createOperation("dummy",
						"dummyGet", "dummyPost");
				
				/*
				 * languages
				 */
				this.capabilities.languages = new Array();

				/*
				 * processes and dummy entry
				 */
				this.capabilities.processes = new Array(1);
				this.capabilities.processes[0] = this.createProcess("title", "id",
						"procVersion", "jobCOntrolOptions",
						"outputTransmission");

				/*
				 * now let child classes fill this empty instance with values
				 */
				this.instantiate(wpsResponse);

			},

			instantiate : function(wpsResponse) {
				// override this method in child classes to properly set the
				// values
			},
			
			createProcess : function(title, identifier, processVersion, jobControlOutputs,
					outputTransmission) {

				var process = new Object();
				process.title = title;
				process.identifier = identifier;
				process.processVersion = processVersion;
				process.jobControlOptions = jobControlOutputs;
				process.outputTransmission = outputTransmission;

				return process;
			},

			createOperation : function(name, getUrl, postUrl) {
				var operation = new Object();
				operation.DCP = new Object();
				operation.DCP.HTTP = new Object();
				operation.DCP.HTTP.name = name;
				operation.DCP.HTTP.get = getUrl;
				operation.DCP.HTTP.post = postUrl;

				return operation;
			},

			createArrayFromTextValues : function(nodes){
				var array = new Array();
				
				for (var int = 0; int < nodes.length; int++) {
					var textValue = $(nodes[int]).text();
					
					array[int] = textValue;
					
				}
				return array;
			}

		});


