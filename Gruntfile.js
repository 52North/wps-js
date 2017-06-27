module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'wps-js',
        context_name: '<%= name %>##<%= pkg.version %>-<%= grunt.template.today("yyyymmddHHMM")%>',
        lib_scripts: [
            'src/web/bower_components/jquery/dist/jquery.min.js'
        ],
        wps_js: [
            'src/web/js/wps-js-lib/lib/Class.js',
			'src/web/js/wps-js-lib/Constants.js',
			'src/web/js/wps-js-lib/Utility.js',
			'src/web/js/wps-js-lib/response/BaseResponse.js',
			'src/web/js/wps-js-lib/response/CapabilitiesResponse.js',
			'src/web/js/wps-js-lib/response/CapabilitiesResponse_xml.js',
			'src/web/js/wps-js-lib/response/CapabilitiesResponse_json.js',
			'src/web/js/wps-js-lib/response/CapabilitiesResponse_v1_xml.js',
			'src/web/js/wps-js-lib/response/CapabilitiesResponse_v2_xml.js',
			'src/web/js/wps-js-lib/response/DescribeProcessResponse.js',
			'src/web/js/wps-js-lib/response/DescribeProcessResponse_json.js',
			'src/web/js/wps-js-lib/response/DescribeProcessResponse_xml.js',
			'src/web/js/wps-js-lib/response/DescribeProcessResponse_v1_xml.js',
			'src/web/js/wps-js-lib/response/DescribeProcessResponse_v2_xml.js',
			'src/web/js/wps-js-lib/response/ExecuteResponse.js',
			'src/web/js/wps-js-lib/response/ExecuteResponse_json.js',
			'src/web/js/wps-js-lib/response/ExecuteResponse_xml.js',
			'src/web/js/wps-js-lib/response/ExecuteResponse_v1_xml.js',
			'src/web/js/wps-js-lib/response/ExecuteResponse_v2_xml.js',
			'src/web/js/wps-js-lib/response/ResponseFactory.js',
			'src/web/js/wps-js-lib/response/ExceptionReportResponse.js',
			'src/web/js/wps-js-lib/request/BaseRequest.js',
			'src/web/js/wps-js-lib/request/GetRequest.js',
			'src/web/js/wps-js-lib/request/PostRequest.js',
			'src/web/js/wps-js-lib/request/InputGenerator.js',
			'src/web/js/wps-js-lib/request/OutputGenerator.js',
			'src/web/js/wps-js-lib/request/ExecuteRequest.js',
			'src/web/js/wps-js-lib/request/ExecuteRequest_json.js',
			'src/web/js/wps-js-lib/request/ExecuteRequest_v1.js',
			'src/web/js/wps-js-lib/request/ExecuteRequest_v2.js',
			'src/web/js/wps-js-lib/request/DescribeProcessGetRequest.js',
			'src/web/js/wps-js-lib/request/DescribeProcessJsonRequest.js',
			'src/web/js/wps-js-lib/request/GetCapabilitiesGetRequest.js',
			'src/web/js/wps-js-lib/request/GetCapabilitiesJsonRequest.js',
			'src/web/js/wps-js-lib/request/DescribeProcessPostRequest.js',
			'src/web/js/wps-js-lib/request/GetCapabilitiesPostRequest.js',
			'src/web/js/wps-js-lib/request/GetStatusGetRequest.js',
			'src/web/js/wps-js-lib/request/GetResultGetRequest.js',
			'src/web/js/wps-js-lib/WpsService.js'
			
        ],
        copy_files: [
            //the path prefix 'src/web/' will be set in the copy-command itself! Thus is omitted here.
            'config/*',
            'demo/**/*',
            'html/*',
            'images/*',
            'jstestdriver/*',
            'xml/*',
            'favicon.ico'
        ],
        clean: ["dist/"],
        tags: {
            options: {
                scriptTemplate: '<script src="{{ path }}" type="text/javascript"></script>',
                linkTemplate: '<link href="{{ path }}" rel="stylesheet" type="text/css"/>'
            },
            build_lib_scripts: {
                options: {
                    openTag: '<!-- start lib script tags -->',
                    closeTag: '<!-- end lib script tags -->'
                },
                src: ['<%= lib_scripts %>'],
                dest: 'src/web/example.html'
            },
            build_client_scripts: {
                options: {
                    openTag: '<!-- start client script tags -->',
                    closeTag: '<!-- end client script tags -->'
                },
                src: ['<%= wps_js %>'],
                dest: 'src/web/example.html'
            }
        },
        concat: {
            libs: {
                src: ['<%= lib_scripts %>'],
                dest: 'dist/js/deps.<%= name %>.js'
            },
            wps: {
                src: '<%= wps_js %>',
                dest: 'dist/js/wps-js-all.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            libs: {
                files: {
                    'dist/js/deps.<%= name %>.min.js': ['<%= concat.libs.dest %>']
                }
            },
            appJs: {
                files: {
                    'dist/wps-js-all.min.js': ['<%= concat.wps.dest %>']
                }
            }
        },
        copy: {
            locals: {
                files: [
                    {expand: true, flatten: false, cwd: 'src/web/', src: '<%= copy_files %>', dest: 'dist/'},
                ]
            }
        },
        //lint the source files
        jshint: {
            files: ['gruntfile.js', 'src/web/js/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        processhtml: {
            options: {
                data: {
                    message: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>'
                }
            },
            index: {
                files: {
                    'dist/example.html': ['src/web/example.html']
                }
            }
        },
        watch: {
            less: {
                files: [ 'bower.json' ],
                tasks: [ 'exec:bower_install' ]
			},
			hint: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint']
			}
        },
		exec: {
			bower_install: {
                cmd: "bower install"
			}
		},
        war: {
            target: {
                options: {
                    war_dist_folder: 'build/',
                    war_name: '<%= context_name %>',
                    webxml_welcome: 'example.html',
                    webxml_display_name: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>',
                    webxml_mime_mapping: [
                        {
                            extension: 'xml',
                            mime_type: 'application/xml'
                        }]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-war');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('env-build', ['tags']);
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy', 'processhtml']);
	grunt.registerTask('buildDebugScript', ['clean', 'concat']);

	grunt.registerTask('buildWar', ['default', 'war']);
//  grunt.registerTask('buildWar', ['test', 'default', 'war']);
};
