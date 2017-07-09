module.exports = function(grunt) {
    var
        _config,
        _banner = '/* js-vastclient - https://github.com/francoisb/js-vastclient */\n';

    _config = {
        clean: {
            build: {
                src: [ 'js-vastclient.js', 'js-vastclient.min.js' ]
            }
        },

        concat: {
            build: {
                src:     [
                            'source/module.header.js',
                            'source/players/base.js',
                            'source/players/companion/html.js',
                            'source/players/companion/iframe.js',
                            'source/players/companion/image.js',
                            'source/players/mediafile/flash.js',
                            'source/players/mediafile/html5.js',
                            'source/models/tracking.js',
                            'source/models/ad.js',
                            'source/models/companion.js',
                            'source/models/creativeCompanion.js',
                            'source/models/creativeLinear.js',
                            'source/models/mediaFile.js',
                            'source/xml/loader.js',
                            'source/xml/parser.js',
                            'source/client.js',
                            'source/module.footer.js',
                         ],
                dest:    'build/js-vastclient.js',
                options: {
                             stripBanners: true,
                             banner:       _banner,
                         },
            }
        },

        uglify: {
            build: {
                options: {
                    compress: {
                        global_defs: {
                          DEBUG: false
                        },
                        dead_code: true
                    },
                    mangle: {
                        except: []
                    },
                    banner: _banner
                },
                files: [{
                    expand: false,
                    src:    'build/js-vastclient.js',
                    dest:   'build/js-vastclient.min.js'
                }]
            }
        },
        jasmine: {
            src: 'build/js-vastclient.js',
            options: {
                specs:    'tests/*Spec.js',
                template: require('grunt-template-jasmine-nml'),

            }
        }

    };

    grunt.initConfig(_config);

    // load the tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // define the tasks
    grunt.registerTask('test', 'Run js-vastclient tests.', [
        'jasmine'
    ]);
    // define the tasks
    grunt.registerTask('build', 'Build js-vastclient.', [
        'clean:build',
        'concat:build',
        'uglify:build'
    ]);
};