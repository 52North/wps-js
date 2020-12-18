wps-js
======

Standalone Javascript OGC Web Processing Service (WPS) API with the following functions:

-	Encoding and parsing of WPS requests for WPS 1.0 and 2.0 (GetCapabilities, DescribeProcess, Execute, getStatus, getResult)
-	Encoding and parsing of WPS responses (Capabilities, ProcessDescription, Execute ResponseDocument (WPS 1.0), Execute ResultDocument (WPS 2.0), StatusInfo Document)

Requirements to develop or build the client
-------------------------------------------

-	[git](https://git-scm.com/)
-	[nodejs](https://nodejs.org)
-	[npm](https://www.npmjs.com/)
-	[grunt](http://gruntjs.com/)

Get ready to start
------------------
- npm install wps-js-52-north
Run the above command to fetch the module directly from npm.

Or Clone directly
------------------
-	`git clone` this repository
-	run `npm install` to get all dependencies

### Get a static files folder which can be added to a web-server

-	with `grunt` all files are collected and build in a `dist` folder. The content of this folder can be deployed on a webserver like Tomcat.

Installation and basic usage
----------------------------

wps-js is a plain Javascipt API. To try out examples follow these steps:

-	Check out the code: `git clone https://github.com/52North/wps-js.git`
-	Change to the directory and perform `npm install` and `grunt` to build the API (which will create a new `dist` folder)
-	Add the file `dist/wps-js-all.min.js` as dependency in your own application.
-	Note that wps-js requires JQuery! So you should include this as well in your application before wps-js.
-	To see how to use the API, please refer to the subsequent Documentation.

Updating wps-js on NPM
----------------------------
Currently, the library wps-js could be found on NPM: https://www.npmjs.com/package/wps-js-52-north

To update update this library on npm, perform the following steps:

-	Check out the code: `git clone https://github.com/52North/wps-js.git`
-	Change to the directory and perform `npm install` and `grunt` to build the API (which will create a new `dist` folder)
-	Add the file `dist/wps-js-all.min.js` and `dist/wps-js-all.js` in the [lib](src/web/lib) folder. (Please add both files as current users use both the files.)
-   Finally, run `npm login` and `npm publish`

Note: This action requires maintainer permission on npm for this library.
 

Documentation
-------------

To use the wps-js API, the most important class is `WpsService`. It acts as the central interface to query Web Processing Services of version 1.0 and 2.0.

### WpsService interface

This section explains how to initialize the `WpsService` object and use it's methods to query any WPS.

#### How to Initialize WpsService

Initialize the object with the following settings:

```
// initialize wpsService
var wpsService = new WpsService({
	url: "http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
	version: "2.0.0"
});
```

At least, you have to provide a valid URL to a WPS instance within the parameter `url`. For parameter `version` valid options are `1.0.0` and `2.0.0`. When omitted, `1.0.0` is used per default.

Should you want to change the `url` or `version` manually, you can call the methods

```
// allowed values : "1.0.0" or "2.0.0"
wpsService.setVersion(newVersion);

// url must be a valid URL to a WPS instance
wpsService.setUrl(url);
```

Once initialized, you may use new variable to execute typical WPS requests. The following subsections describe each operation.

#### Info on Response

For each subsequent request, a callback function has to be defined, which is called with the corresponding response of the WPS. This structure of the response object depends on the following two cases:

-	success: the request was successful and a valid response was generated. Then the callback function is called with a parameter 'response', which contains two properties, 'responseDocument' (the raw XML response from the WPS) and a request-specific JavaScript Object representation of the WPS response. E.g. a valid Capabilities request responds with:

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.responseDocument // raw response of WPS (XML encoded response).
response.capabilities // all properties of the WPS Capabilities response encoded as JavaScript properties.

```

Clearly, for each different request type, the second property will differ (see method details below).

-	error: an error occurred. Then no valid response object could be constructed and the response will include two error properties (which are simply forwarded from the failing WPS request):

```
// call callback function
callbackFunction(errorObject);

------------------------------

// where errorObject has structure:
errorObject.textStatus
errorObject.errorThrown

```

#### GetCapabilities Request

```
/**
 * getCapabilities via HTTP GET
 *
 * @callbackFunction is called with a parameter 'wpsResponse' after the WPS was contacted. The parameter 'wpsResponse' either comprises a JavaScript Object representation of the WPS response or, if an error occured, error properties 'textStatus' and/or 'errorThrown'!
 */
wpsService.getCapabilities_GET(callbackFunction);
```

```
/**
 * getCapabilities via HTTP POST
 *
 * @callbackFunction is called with a parameter 'wpsResponse' after the WPS was contacted. The parameter 'wpsResponse' either comprises a JavaScript Object representation of the WPS response or, if an error occured, error properties 'textStatus' and/or 'errorThrown'!
 */
wpsService.getCapabilities_POST(callbackFunction);
```

#### GetCapabilities Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.responseDocument // raw response of WPS (XML encoded response).
response.capabilities // all properties of the WPS Capabilities response encoded as JavaScript properties according to WPS 2.0 standard.

```

#### DescribeProcess Request

```
/**
 * process description via HTTP GET
 *
 * @callbackFunction is called with a parameter 'wpsResponse' after the WPS was contacted. The parameter 'wpsResponse' either comprises a JavaScript Object representation of the WPS response or, if an error occured, error properties 'textStatus' and/or 'errorThrown'! .
 *                   Takes the response object as argument
 * @processIdentifier the identifier of the process
 */
wpsService.describeProcess_GET(callbackFunction, processIdentifier);
```

```
/**
 * process description via HTTP POST
 *
 * @callbackFunction is called with a parameter 'wpsResponse' after the WPS was contacted. The parameter 'wpsResponse' either comprises a JavaScript Object representation of the WPS response or, if an error occured, error properties 'textStatus' and/or 'errorThrown'! .
 *                   Takes the response object as argument
 * @processIdentifier the identifier of the process
 */
wpsService.describeProcess_POST(callbackFunction, processIdentifier);
```

#### DescribeProcess Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.responseDocument // raw response of WPS (XML encoded response).
response.processOffering // all properties of the WPS DescribeProcess response encoded as JavaScript properties according to WPS 2.0 standard.
```

#### Execute Request

```
/**
 * WPS execute request via HTTP POST
 *
 * @callbackFunction is called with a parameter 'wpsResponse' after the WPS was contacted. The parameter 'wpsResponse' either comprises a JavaScript Object representation of the WPS response or, if an error occured, error properties 'textStatus' and/or 'errorThrown'! .
 *                   Takes the response object as argument
 * @processIdentifier the identifier of the process
 * @responseFormat either "raw" or "document", default is "document"
 * @executionMode either "sync" or "async";
 * @lineage only relevant for WPS 1.0; boolean, if "true" then returned
 *          response will include original input and output definition; false per default
 * @inputs an array of needed Input objects, use JS-object InputGenerator to
 *         create inputs
 * @outputs an array of requested Output objects, use JS-object
 *          OutputGenerator to create inputs
 */
wpsService.execute(callbackFunction, processIdentifier, responseFormat, executionMode, lineage, inputs, outputs);
```

As you notice, to create the arrays of `inputs` and `outputs`, you have to use the JavaScript class `InputGenerator` and `OutputGenerator`. A description of those can be found further below.

#### Execute Response

Whereas in the previous requests/responses there were no differences between different WPS versions, an execute response is very different for WPS 1.0 and 2.0 services.

In general, the a response has the following basic structure:

```
// call callback function
callbackFunction(response);

------------------------------

// basic structure of execute response:
response.type // is set to one of { responseDocument | resultDocument | statusInfoDocument | rawOutput }
response.serviceVersion // is set to one of { 1.0.0 | 2.0.0 }
response.responseDocument // property that stores the contents of response (structure depends on type!)
```

-	type 'rawOutput' stands for raw output
-	type 'responseDocument' stands for a WPS 1.0.0 response document
-	type 'resultDocument' stands for a WPS 2.0.0 result document (in response to a synchronous execution)
-	type 'resultDocument' stands for a WPS 2.0.0 status info document (in response to an asynchronous execution)

In accordance to the 'type' property, the structure of the property 'responseDocument' varies, as shown in the subsequent request descriptions.

#### WPS 1.0.0 Execute Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.type = "responseDocument"
response.serviceVersion = "1.0.0"
response.responseDocument.service = "WPS"
response.responseDocument.version = "1.0.0"
response.responseDocument.lang = "EN" // language
response.responseDocument.statusLocation = "url" // URL to statuslocation in case of asynchronous execution or 'undefined'
response.responseDocument.process.identifier = "processId"
response.responseDocument.process.title = "processTitle"
response.responseDocument.status.creationTime = "creationTime"
response.responseDocument.status.info = "infoMessage"
response.responseDocument.outputs // array of outputs
```

#### Retrieve Stored ExecuteResponse (WPS 1.0.0)

For WPS 1.0.0 execute operation you may define to execute it asynchronously and store a status document on the server, which is updated by the WPS. With the following method you can retrieve the updated document.

```
/**
 * Only relevant for WPS 1.0
 *
 * @callbackFunction a callback function that will be triggered with the
 *                   parsed executeResponse as argument
 * @storedExecuteResponseLocation the url, where the execute response document
 *                                is located / can be retrieved from
 */
wpsService.parseStoredExecuteResponse_WPS_1_0(callbackFunction, storedExecuteResponseLocation);
```

#### Retrieve Stored ExecuteResponse (WPS 1.0.0) - Response

identical to WPS 1.0.0 Execute Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.type = "responseDocument"
response.serviceVersion = "1.0.0"
response.responseDocument.service = "WPS"
response.responseDocument.version = "1.0.0"
response.responseDocument.lang = "EN" // language
response.responseDocument.statusLocation = "url" // URL to statuslocation in case of asynchronous execution or 'undefined'
response.responseDocument.process.identifier = "processId"
response.responseDocument.process.title = "processTitle"
response.responseDocument.status.creationTime = "creationTime"
response.responseDocument.status.info = "infoMessage"
response.responseDocument.outputs // array of outputs
```

#### GetStatus (WPS 2.0.0)

The `GetStatus` operation is only defined for WPS 2.0.0 and retrieves a `StatusInfo Document` from the WPS service, which is generated as a result of an asynchronous `Execute` request.

```
/**
 * WPS 2.0 getStatus operation to retrieve the status of an executed job
 *
 * Not usable with WPS 1.0
 *
 * @callbackFunction a callback function that will be triggered with the
 *                   parsed StatusInfo document as argument
 * @jobId the ID of the asynchronously executed job
 */
wpsService.getStatus_WPS_2_0(callbackFunction, jobId);
```

#### GetStatus Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.type = "statusInfoDocument"
response.serviceVersion = "2.0.0"
response.responseDocument.jobId = "jobId" // job id of executed process
response.responseDocument.status = "status" // job status
response.responseDocument.expirationDate = "jobId" // expiration date of job
response.responseDocument.estimatedCompletion = "estimatedCompletion" // estimated completion
response.responseDocument.nextPoll = "nextPoll" // next poll
response.responseDocument.percentCompleted = "42" // job completion in percent
```

#### GetResult (WPS 2.0.0)

The `GetResult` operation is only defined for WPS 2.0.0 and retrieves a `ResultDocument` from the WPS service (when a `Job` was executed asynchronously and has finished, then the result may be retrieved this way).

```
/**
 * WPS 2.0 getResult operation to retrieve the status of an executed job
 *
 * Not usable with WPS 1.0
 *
 * @callbackFunction a callback function that will be triggered with the
 *                   parsed StatusInfo document as argument
 * @jobId the ID of the asynchronously executed job
 */
wpsService.getResult_WPS_2_0(callbackFunction, jobId);
```

####GetResult Response

```
// call callback function
callbackFunction(response);

------------------------------

// where response has structure:
response.jobId = "jobId" // job id of finished job
response.expirationDate = "expirationDate" // expiration date of job
response.responseDocument.outputs // array of outputs
```

### InputGenerator Interface

The `InputGenerator` is used to create `Input` objects for an `Execute` request.

To initialize it do the following:

```
// new instance of InputGenerator
var inputGenerator = new InputGenerator();
```

After that you can use the following methods to create valid Input objects.

#### Literal Data Input

```
/**
 * the following parameters are mandatory: identifier and value
 *
 * the rest might be set to 'undefined'!
 *
 * @identifier input identifier
 * @dataType data type of the input; may be 'undefined'
 * @uom unit of measure; may be 'undefined'
 * @value the literal value of the input
 */
var literalInput = inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(identifier, dataType, uom, value);
```

#### Complex Data Input

```
/**
 * the following parameters are mandatory: identifier and complexPayload
 *
 * the rest might be set to 'undefined'!
 *
 * @identifier input identifier
 * @mimeType MIME type of the input; may be 'undefined'
 * @schema reference to a schema; may be 'undefined'
 * @encoding encoding; may be 'undefined'
 * @asReference boolean, either "true" or "false", indicating
 *              whether parameter body contains a URL as reference
 *              to an external body or the actual POST body
 * @complexPayload the complex payload as String
 */
var complexInput = inputGenerator.createComplexDataInput_wps_1_0_and_2_0(identifier,
					mimeType, schema, encoding, asReference, complexPayload);
```

#### Bounding Box Data Input

```
/**
 * the following parameters are mandatory: identifier, crs,
 * lowerCorner and upperCorner
 *
 * the rest might be set to 'undefined'!
 *
 * @identifier input identifier
 * @crs coordinate reference system URI
 * @dimension number of dimensions in this CRS
 * @lowerCorner orderedSequence of double values
 * @upperCorner orderedSequence of double values
 */
var bboxInput = inputGenerator.createBboxDataInput_wps_1_0_and_2_0(identifier, crs,
					dimension, lowerCorner, upperCorner);
```

### OutputGenerator Interface

The `OutputGenerator` is used to create `Output` objects for an `Execute` request.

To initialize it do the following:

```
// new instance of OutputGenerator
var outputGenerator = new OutputGenerator();
```

After that you can use the following methods to create valid `Output` objects. In contrast to the `InputGenerator`, the methods are specialized for different WPS version, since they require different parameters.

#### Literal Data Output WPS 1.0.0

```
/**
 * the following parameters are mandatory: identifier
 *
 * @identifier output identifier
 * @asReference boolean, "true" or "false"
 */
var literalOutput = outputGenerator.createLiteralOutput_WPS_1_0(identifier, asReference);
```

#### Complex Data Output WPS 1.0.0

```
/**
 * the following parameters are mandatory: identifier
 *
 * the rest might be set to 'undefined'!
 *
 * @identifier output identifier
 * @mimeType MIME type of the input; may be 'undefined'
 * @schema reference to a schema; may be 'undefined'
 * @encoding encoding; may be 'undefined'
 * @uom unit of measure; may be 'undefined'
 * @asReference boolean, "true" or "false"
 * @title new title
 * @abstractValue new description as text of the 'Abstract' element
 *                of the response document
 */
var complexOutput = outputGenerator.createComplexOutput_WPS_1_0(identifier, asReferenceidentifier, mimeType, schema,
			encoding, uom, asReference, title, abstractValue);
```

#### Literal Data Output WPS 2.0.0

```
/**
 * the following parameters are mandatory: identifier and transmission
 *
 * @identifier output identifier
 * @transmission either "value" or "reference"
 */
var literalOutput = outputGenerator.createLiteralOutput_WPS_2_0(identifier, transmission);
```

#### Complex Data Output WPS 2.0.0

```
/**
 * the following parameters are mandatory: identifier and transmission
 *
 * the rest might be set to 'undefined'!
 *
 * @identifier output identifier
 * @mimeType MIME type of the input; may be 'undefined'
 * @schema reference to a schema; may be 'undefined'
 * @encoding encoding; may be 'undefined'
 * @transmission either "value" or "reference"
 */
var complexOutput = outputGenerator.createComplexOutput_WPS_2_0(identifier, mimeType, schema,
			encoding, transmission);
```

License
-------

wps-js is published under Apache Software License, Version 2.0

The used libraries are:

-	jQuery - MIT License - https://jquery.org/license/

Contact / Support
-----------------

To get help in running wps-js, please use the Geoprocessing community mailing list and forum: http://geoprocessing.forum.52north.org/

Please leave an issue on GitHub if you have any bug reports or feature requests: https://github.com/52North/wps-js/issues

Contact: Benjamin Proß (b.pross@52north.org)
