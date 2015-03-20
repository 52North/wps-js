# wps-js

Standalone Javascript OGC Web Processing Service (WPS) client with the following functions:

* Generation of an HTML form based on WPS process descriptions
* Encoding and parsing of WPS requests (GetCapabilities, DescribeProcess, Execute)

## Installation

wps-js is a plain Javascipt client and all required libraries are shipped with the code. To try out examples follow these steps:

* Start a proxy server so that it serves requests preprended with ``/wps_proxy/wps_proxy?url=``
* Check out the code: ``git clone https://github.com/52North/wps-js.git``
* Change to the directory and build the application with Maven: ``cd wps-js``, then ``mvn clean install``
* Open the file ``../target/wps-js-<version>/index.html`` in a browser to try out the client
* Use the file ``../target/wps-js-<versionjs/wps-js/wps-js.<version>(.min).js`` in your own application.

## Configuration

Configuration of the proxy URL:

```
$(document).ready(function() {
	$.wpsSetup({
		proxy : {
			url : "/wps_proxy/wps_proxy?url=",
			type : "parameter"
		}
	});
});
```

### Configure wps-js to display image outputs directly in the client

In order to display image outputs directly, you will have to set a flag in the configuration:
```
$(document).ready(function() {
	$.wpsSetup({
		proxy : {
			url : "/wps_proxy/wps_proxy?url=",
			type : "parameter"
		},
		configuration : {
		    showImages : true
		}
	});
});
```
The image will be displayed inside a HTML ``<img>``-tag using the data URI scheme: http://en.wikipedia.org/wiki/Data_URI_scheme

**Note that only base64-encoded images can be displayed directly at the moment, so the process will have to support this output encoding.**

Some common image MIME types are defined in the properties.json: ``"imageMimetypes": ["image/gif","image/jpeg","image/jpg","image/png"]``

Depending on the MIME types your browser and WPS are supporting, you can modify this list. 

### Configure wps-js to use client-side default values for inputs and outputs

You can also use a template to pre-configure the contents of the form that is generated.

For this you will have to define a JavaScript variable called ``clientSideDefaultValues`` with the following structure:

```
var clientSideDefaultValues = {
	"algorithm.identifier1" : {
		"inputs" : {
			"input.id1" : [
					{
						"value" : "",
						"mimeType" : "",
						"schema" : "",
						"encoding" : "",
						"hidden" : true/false
						"asReference" : true/false 
					},{
						"value" : "",
						...
					}]
		},
		"outputs" : {
			"output.id1" : {
				"mimeType" : "",
				"schema" : "",
				"encoding" : "",
				"asReference" : true/false,
				"hidden" : true/false
			},			
			"output.id2" : {
				"mimeType" : "",
				...
			}
		}
	},
	"algorithm.identifier2" : {
		"inputs" : 
    ...
	}
};
```

For each process you want a pre-configured form for, you will have to specify an object named like the process identifier.
This object will have two sub-objects for the inputs and outputs, named accordingly. These sub-objects can in turn have sub-objects for each input/output named like the respective identifier.
The single input/output output basically have the same structure. They can have the following attributes (all optional):

* "mimeType" : String containing the MIME type of the input/output
* "schema" : String containing the schema of the input/output
* "encoding" : String containing the encoding of the input/output
* "asReference" : Boolean to specify whether the input/output should be fetched from an URL  
* "hidden" : Boolean to specify whether the input/output should be hidden in the execute form
* "value" : *Only input*, the value of the input as String

*Note:* Each input object needs an array (``[]``) wrapped around the object(s) with the above structure, as there can be multiple inputs with the same identifier.
For an input/output to appear on the form it has to be specified in the inputs/outputs object. The object can be empty, but has to be there. Otherwise it will not be shown in the form at all.

Example:

```
var clientSideDefaultValues = {
	"org.n52.wps.server.algorithm.test.MultipleComplexInAndOutputsDummyTestClass" : {
		"inputs" : {
			"ComplexInputData1" : [
					{
						"value" : "iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgCAMAAABKCk6nAAAAA1BMVEX///+nxBvIAAAA9klEQVR4"
                                 +"nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                                 +"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                                 +"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                                 +"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                                 +"AAAAAAAAAAAAAAD8G4YNAAGL73n/AAAAAElFTkSuQmCC",
						"mimeType" : "image/png",
						"encoding" : "base64",
					}],
			"ComplexInputData2" : [
			        {
						"value" : "http://localhost:8080/testdata/52n346x346-transp.png",
						"mimeType" : "image/png",
						"asReference" :true
					}],
			"LiteralInputData" : [
			        {
						"value" : "XYZ",
						"hidden" : true 
					}],
			"BBOXInputData" : [
			        {
						"value" : "7,51,8,52",
					}]
		},
		"outputs" : {
			"ComplexOutputData1" : {
				"mimeType" : "image/png",
				"encoding" : "base64",
				"asReference" : true
			},			
			"ComplexOutputData2" : {
				"mimeType" : "image/png",
				"encoding" : "base64",
				"hidden" : true 
			},
			"LiteralOutputData" : {
				"hidden" : true 
			},
			"BBOXOutputData" : { 
			}
		}
	}
};
```

## Documentation

Project and user documentation can be found in the 52°North wiki: https://wiki.52north.org/bin/view/Geoprocessing/Wps-js

## Development

wps-js uses Maven for the build process, which means that the source code is split up across many files in the folder ``src/main/webapp/js/wps-js``. Within this directory, a **Javscript class hierarchy** for reqeusts and responses is implemented in the directories ``request`` and ``response`` respectively.

### Tomcat configuration

#### Catalina context
A simple configuration of a Tomcat servlet container to develop wps-js is to point the context of the webapp to the Maven target directory. Put the following lines into a file ``<Tomcat dir>\conf\Catalina\localhost\wps-js.xml`` and restart the servlet container:

```
<Context 
  docBase="/your/path/to/wps-js/target/wps-js-1.0.0-SNAPSHOT/" 
/>
```

You can then update the deployed copy by running ``mvn package -DskiptTests=true``.

#### Eclipse WTP

Alternatively configuration with the web tools plug-in in Eclipse: Open your server configuration, then the tab "Modules" and add the path ``<your path>/wps-js/target/wps-js-1.0.0-SNAPSHOT`` as the document base and any path, for example ``/wps-js``.

### Proxy

wps-js needs a proxy server to connect to WPS server instances. A simple one is jproxy, see https://github.com/matthesrieke/jprox. wps-js will by default look for a proxy at ``/wps_proxy/wps_proxy?url=``.

#### jprox configuration

Make sure you use the following parameters in jprox's ``web.xml`` and deploy it as ``wps_proxy.war`` to make it work with the default wps-js configuration.

```
[...]
<param-name>parameterKey</param-name>
<param-value>url</param-value>
[...]
<servlet-mapping>
	<servlet-name>JProxViaParameterServlet</servlet-name>
	<url-pattern>/</url-pattern>
[...]
```

Alternatively, you can also import jproxy as a project in Eclipse and configure it as a web module for your testing server in the WTP plug-in using the path ``/wps_proxy``.

## License

wps-js is published under Apache Software License, Version 2.0

The used libraries are:

* jQuery - MIT License (https://jquery.org/license/)
* OpenLayers - 2-clause BSD License (http://openlayers.org/)
* js-test-driver - Apache License 2.0 (http://code.google.com/p/js-test-driver/)

## Contact / Support
To get help in running wps-js, please use the Geoprocessing community mailing list and forum: http://geoprocessing.forum.52north.org/

Please leave an issue on GitHub if you have any bug reports or feature requests: https://github.com/52North/sos-js/issues

Contact: Matthes Rieke (m.rieke@52north.org), Daniel Nüst (d.nuest@52north.org)
