/*****************************************************************************
 *                       HELPER FUNCTIONS FOR GUI                            *
 ****************************************************************************/

function clear() {
  xmlvariant = undefined;
  jsonvariant = undefined;
  document.getElementById('output1').value = '';
  document.getElementById('output2').value = '';
}

function logAndCompareXml(response) {
  xmlvariant = response;
  // The two logAndCompare functions are called asynchronously, whichever terminates last invokes the compare function
  if(typeof jsonvariant != 'undefined') compare();
}

function logAndCompareJson(response) {
  jsonvariant = response;
  if(typeof xmlvariant != 'undefined') compare();
}

function compare() {
  // output to console
  console.log('XML:');
  console.log(xmlvariant);
  console.log('JSON:');
  console.log(jsonvariant);
  
  // used by replacer function
  seen = [];
  
  // output to HTML
  document.getElementById('output1').value = JSON.stringify(xmlvariant,  null,     "\t");
  document.getElementById('output2').value = JSON.stringify(jsonvariant, replacer, "\t");
  
  console.log('---');
}

/**
 * Helper function to make stringifying possible even if cyclic structures should be there.
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 */
function replacer(key, value) {
  if (value != null && typeof value == "object") {
    if (seen.indexOf(value) >= 0) {
      return;
    }
    seen.push(value);
  }
  return value;
}


/*****************************************************************************
 *                       HELPER FUNCTIONS FOR TESTING                        *
 ****************************************************************************/

function giveClassicWps() {
  return new WpsService({
  	url: "http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
  	version: "2.0.0"
  });
}

function giveRestfulWps() {
  return new WpsService({
  	url: "http://geoprocessing.demo.52north.org:8080/wps-proxy-2",
  	version: "2.0.0",
    isRest: true
  });
}


/*****************************************************************************
 *        HELPER FUNCTIONS TO CONSTRUCT TEST'S INPUT/OUTPUT DATA             *
 ****************************************************************************/

function giveInputs() {
  var ig = new InputGenerator();
  var inputs = [];
  inputs.push(ig.createComplexDataInput_wps_1_0_and_2_0('data', 'application/vnd.geo+json', undefined, undefined, false, '{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[7.620563507080078,51.94246595679555],[7.6197052001953125,51.96753854150881]]}}]}'));
  inputs.push(ig.createLiteralDataInput_wps_1_0_and_2_0('width', undefined, undefined, 1));
  return inputs;
}

function giveLiteralInputs() {
  var ig = new InputGenerator();
  var inputs = [];
  inputs.push(ig.createLiteralDataInput_wps_1_0_and_2_0('LiteralInputData', undefined, undefined, 0.05));
  return inputs;
}

function giveOutputs() {
  var og = new OutputGenerator();
  var outputs = [];
  outputs.push(og.createComplexOutput_WPS_2_0('result', 'application/vnd.geo+json', undefined, undefined, 'value'));
  return outputs;
}

function giveLiteralOutputs() {
  var og = new OutputGenerator();
  var outputs = [];
  outputs.push(og.createLiteralOutput_WPS_2_0('LiteralOutputData', 'value'));
  return outputs;
}

function giveOutputsAsReference() {
  var og = new OutputGenerator();
  var outputs = [];
  outputs.push(og.createComplexOutput_WPS_2_0('result', 'application/vnd.geo+json', undefined, undefined, 'reference'));
  return outputs;
}


/*****************************************************************************
 *                          TESTS                                            *
 ****************************************************************************/

/**
 * Test GetCapabilities operation
 */
function testGetCap() {
  clear();
  giveClassicWps().getCapabilities(logAndCompareXml);
  giveRestfulWps().getCapabilities(logAndCompareJson);
}

/**
 * Test DescribeProcess operation
 */
function testDescProc() {
  clear();
  giveClassicWps().describeProcess(logAndCompareXml,  'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm');
  giveRestfulWps().describeProcess(logAndCompareJson, 'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm');
}

/**
 * Test Execute operation with executionMode=async, responseFormat=document, lineage=false, two inputs (complex and literal) passed by value and complex output passed by value
 */
function testExec() {
  clear();
  // parameters:                                                                            responseFormat  execution-mode lineage
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'async', false, giveInputs(), giveOutputs());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'async', false, giveInputs(), giveOutputs());
}

/**
 * Test Execute operation like testExec, but with sync execution mode instead of async
 */
function testExecSync() {
  clear();
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'sync', false, giveInputs(), giveOutputs());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'sync', false, giveInputs(), giveOutputs());
}

/**
 * Test Execute operation like testExecSync, but with literal input and output only (and only 1 input instead of 2)
 */
function testExecLiteralSync() {
  clear();
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.test.DummyTestClass', 'document', 'sync', false, giveLiteralInputs(), giveLiteralOutputs());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.test.DummyTestClass', 'document', 'sync', false, giveLiteralInputs(), giveLiteralOutputs());
}

/**
 * Test Execute operation like testExecSync, but output passed by reference instead of by value
 */
function testExecReferenceSync() {
  clear();
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'sync', false, giveInputs(), giveOutputsAsReference());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'document', 'sync', false, giveInputs(), giveOutputsAsReference());
}

/**
 * Test Execute operation like testExec, but with responseFormat=raw instead of document (FAILS because that's not yet supported by the proxy)
 */
function testExecRaw() {
  clear();
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'raw', 'async', false, giveInputs(), giveOutputs());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'raw', 'async', false, giveInputs(), giveOutputs());
}

/**
 * Test Execute operation like testExecRaw, but with sync execution mode instead of async (FAILS because that's not yet supported by the proxy)
 */
function testExecRawSync() {
  clear();
  giveClassicWps().execute(logAndCompareXml,  'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'raw', 'sync', false, giveInputs(), giveOutputs());
  giveRestfulWps().execute(logAndCompareJson, 'org.n52.wps.server.algorithm.SimpleBufferAlgorithm', 'raw', 'sync', false, giveInputs(), giveOutputs());
}

/**
 * Test GetStatus operation (if neccessary, adjust the jobId to one you recently submitted to the server)
 */
function testGetStatus() {
  clear();
  giveClassicWps().getStatus_WPS_2_0(logAndCompareXml,  '29fe2c08-f54d-4e75-8c52-e710e6f04e9a');
  giveRestfulWps().getStatus_WPS_2_0(logAndCompareJson, '29fe2c08-f54d-4e75-8c52-e710e6f04e9a');
}

/**
 * Test GetResult operation (if neccessary, adjust the jobId to one you recently submitted to the server)
 */
function testGetResult() {
  clear();
  giveClassicWps().getResult_WPS_2_0(logAndCompareXml,  '29fe2c08-f54d-4e75-8c52-e710e6f04e9a');
  giveRestfulWps().getResult_WPS_2_0(logAndCompareJson, '29fe2c08-f54d-4e75-8c52-e710e6f04e9a');
}