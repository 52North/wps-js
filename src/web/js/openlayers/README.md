wps-js is using a modified OpenLayers API. The WPS handling of the API was improved.
The modified version of the API is available here:

https://github.com/bpross-52n/openlayers/tree/feature/enhance-wps-handling

To build the compressed modified OpenLayers API run (in the build directory):

python build.py -c closure full OpenLayers-closure.js
