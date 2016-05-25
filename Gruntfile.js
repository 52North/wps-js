module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'wps-js',
        context_name: '<%= name %>##<%= pkg.version %>-<%= grunt.template.today("yyyymmddHHMM")%>',
        lib_scripts: [
            'src/web/bower_components/jquery/jquery.js',
		  	'src/web/bower_components/jquery-ui/jquery-ui.js',
			//after bower install the local OpenLayers-closure.js (from folder src/web/js/openlayers) will be stored as index.js in local bower_components directory
			'src/web/bower_components/openlayers/index.js'
        ],
        lib_styles: [
            
        ],
        wps_js: [
            'src/web/js/wps-js/lib/Class.js',
			'src/web/js/wps-js/lib/purl.js',
			'src/web/js/wps-js/lib/jquery.tmpl.1.0.0pre.js',
			'src/web/js/wps-js/Constants.js',
			'src/web/js/wps-js/Utility.js',
			'src/web/js/wps-js/model/WPSConfiguration.js',
			'src/web/js/wps-js/response/BaseResponse.js',
			'src/web/js/wps-js/response/CapabilitiesResponse.js',
			'src/web/js/wps-js/response/DescribeProcessResponse.js',
			'src/web/js/wps-js/response/ExecuteResponse.js',
			'src/web/js/wps-js/response/ResponseFactory.js',
			'src/web/js/wps-js/response/ExceptionReportResponse.js',
			'src/web/js/wps-js/request/BaseRequest.js',
			'src/web/js/wps-js/request/GetRequest.js',
			'src/web/js/wps-js/request/PostRequest.js',
			'src/web/js/wps-js/request/ExecuteRequest.js',
			'src/web/js/wps-js/request/DescribeProcessGetRequest.js',
			'src/web/js/wps-js/request/GetCapabilitiesGetRequest.js',
			'src/web/js/wps-js/request/DescribeProcessPostRequest.js',
			'src/web/js/wps-js/request/GetCapabilitiesPostRequest.js',
			'src/web/js/wps-js/form/FormBuilder.js',
			'src/web/js/wps-js/form/FormParser.js',
			'src/web/js/wps-js/wps-js.js'
        ],
        wps_styles: [
            'src/web/css/**/*.css'
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
            },
            build_lib_styles: {
                options: {
                    openTag: '<!-- start lib style tags -->',
                    closeTag: '<!-- end lib style tags -->'
                },
                src: ['<%= lib_styles %>'],
                dest: 'src/web/example.html'
            },
            build_client_styles: {
                options: {
                    openTag: '<!-- start client style tags -->',
                    closeTag: '<!-- end client style tags -->'
                },
                src: ['<%= wps_styles %>'],
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
            },
            styles: {
                src: 'src/web/css/**/*.css',
                dest: 'dist/css/<%= name %>.css'
            },
            libStyles: {
                src: '<%= lib_styles %>',
                dest: 'dist/css/deps.<%= name %>.css'
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
        cssmin: {
            options: {
            },
            styles: {
                files: {
                    'dist/css/<%= name %>.min.css': ['<%= concat.styles.dest %>']
                }
            },
            depStyles: {
                files: {
                    'dist/css/deps.<%= name %>.min.css': ['<%= concat.libStyles.dest %>']
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
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
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'copy', 'processhtml']);

	grunt.registerTask('buildWar', ['default', 'war']);
//  grunt.registerTask('buildWar', ['test', 'default', 'war']);
};
