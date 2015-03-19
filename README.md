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

You can also use a template file to pre-configure the contents of the form that is generated - see example ``src/main/webapp/demo/geca-intercomparison/client.html``.

TO BE ENHANCED...

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
