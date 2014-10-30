var clientSideDefaultValues = {
	"org.n52.wps.server.algorithm.test.MultiReferenceBinaryInputAlgorithm" : {
		"inputs" : {
			"data" : [
					{
						"value" : "http://geoprocessing.demo.52north.org:8080/geoserver/wfs?SERVICE=WFS&amp;VERSION=1.0.0&amp;REQUEST=GetFeature&amp;TYPENAME=topp:tasmania_roads&amp;SRS=EPSG:4326&amp;OUTPUTFORMAT=GML3",
						"mimeType" : "application/json",
						"schema" : "",
						"encoding" : "",
						"asReference" : true
					},
					{
						"value" : "http://geoprocessing.demo.52north.org:8080/geoserver/wfs?SERVICE=WFS&amp;VERSION=1.0.0&amp;REQUEST=GetFeature&amp;TYPENAME=topp:tasmania_roads&amp;SRS=EPSG:4326&amp;OUTPUTFORMAT=GML3",
						"asReference" : true
					} ]
		},
		"outputs" : {
			"result" : {
				"mimeType" : "application/json",
				"schema" : "",
				"encoding" : "",
				"asReference" : true
			}
		}
	}
};
