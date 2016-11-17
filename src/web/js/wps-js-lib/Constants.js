var WPS_VERSION_1_0_0 = "1.0.0"
var WPS_VERSION_2_0_0 = "2.0.0"

var GET_CAPABILITIES_TYPE = "GetCapabilities"; 
var DESCRIBE_PROCESS_TYPE = "DescribeProcess";
var EXECUTE_TYPE = "Execute";
var GET_STATUS_TYPE = "GetStatus";
var GET_RESULT_TYPE = "GetResult";

var OWS_11_NAMESPACE = "http://www.opengis.net/ows/1.1";
var WPS_100_NAMESPACE = "http://www.opengis.net/wps/1.0.0";

var METHOD_POST = "POST";
var METHOD_GET = "GET";
var PARAM_WPS_REQUEST_URL = "wpsRequestUrl";
var PARAM_WPS_REQUEST_TYPE = "wpsRequestType";

var USE_PROXY = false;
var PROXY_URL = "";
var PROXY_TYPE = "";

var USER_TEMPLATE_CAPABILITIES_MARKUP = null;
var USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP = null;
var USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP = null;

var DATA_TYPE_LITERAL = "LITERAL";
var DATA_TYPE_COMPLEX = "COMPLEX";
var DATA_TYPE_BBOX = "BBOX";

function wpsResetSetup() {
	USE_PROXY = false;
	PROXY_URL = "";
	PROXY_TYPE = "";

	USER_TEMPLATE_CAPABILITIES_MARKUP = null;
	USER_TEMPLATE_PROCESS_DESCRIPTION_MARKUP = null;
	USER_TEMPLATE_EXECUTE_RESPONSE_MARKUP = null;
}
