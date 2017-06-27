/**
 * General XML response
 */
var ExecuteResponse_xml = ExecuteResponse.extend({
	extractLiteralDataFromXml : function(literalData_xmlNode) {
		return {
			literalData : {
				dataType : literalData_xmlNode.attr("dataType") || undefined,
				uom : literalData_xmlNode.attr("uom") || undefined,
				value : literalData_xmlNode.text()
			}
		};
	},
	
	extractComplexDataFromXml : function(complexData_xmlNode) {
		return {
			complexData : {
				mimeType : complexData_xmlNode.attr("mimeType") || undefined,
				schema : complexData_xmlNode.attr("schema") || undefined,
				encoding : complexData_xmlNode.attr("encoding") || undefined,
				value : complexData_xmlNode.html()
			}
		};
	},
	
	extractBboxDataFromXml : function(bboxData_xmlNode) {
		return {
			boundingBoxData : {
				crs : bboxData_xmlNode.attr("crs") || undefined,
				dimensions : bboxData_xmlNode.attr("dimensions") || undefined,
				lowerCorner : bboxData_xmlNode.attr("lowerCorner") || bboxData_xmlNode.find("ows\\:LowerCorner, LowerCorner").text(),
				upperCorner : bboxData_xmlNode.attr("upperCorner") || bboxData_xmlNode.find("ows\\:UpperCorner, UpperCorner").text()
			}
		};
	}
});
