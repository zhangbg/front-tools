module.exports = function(grunt) {
    var mozjpeg = require('imagemin-mozjpeg');
    var config = {
            baseUrl: 'styles',
            paths: {
                'jquery': 'plugins/jquery-1.10.2.min',
                'jquery-migrate': 'plugins/jquery-migrate-1.2.1.min',
                'jquery-ui': 'plugins/jquery-ui/jquery-ui-1.10.3.custom.min',
                'bootstrap': 'plugins/bootstrap/js/bootstrap.min',
                'jquery.blockui': 'plugins/jquery.blockui.min',
                'jquery.cookie': 'plugins/jquery.cookie.min',
                'jquery.uniform': 'plugins/uniform/jquery.uniform.min',
                'jquery.validate': 'plugins/jquery-validation/dist/jquery.validate.min',
                'jquery.backstretch': 'plugins/backstretch/jquery.backstretch.min',
                //self script
                'app': 'plugins/metronic/app',
                'config': 'scripts/config',
                'login-soft': 'scripts/login-soft'
            },
            shim: {
                'jquery-migrate': ['jquery'],
                'jquery-ui': ['jquery'],
                'bootstrap': ['jquery'],
                'app': ['jquery'],
                'jquery.uniform': ['jquery'],
                'jquery.validate': ['jquery'],
                'jquery.backstretch': ['jquery']
            }
        },
        dependencies = [
            'jquery',
            'jquery-migrate',
            'jquery-ui',
            'bootstrap',
            'jquery.blockui',
            'jquery.cookie',
            'jquery.uniform',
            'jquery.validate',
            'jquery.backstretch',
            'app',
            'config',
            'login-soft'
        ];

    var jsSrcs = [],
        temp = null;
    for (var i = 0, length = dependencies.length; i < length; i++) {
        jsSrcs.push(config.baseUrl + '/' + config.paths[dependencies[i]] + '.js');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                options: {
                    stripBanners: true,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */',
                },
                separator: ';\n\n'
            },
            dist: {
                src: jsSrcs,
                dest: 'dist/<%= pkg.name %>-login.js'
            },
            css: {
                options: {
                    separator: '\n\n'
                },
                src: ['styles/plugins/bootstrap/css/bootstrap.min.css', 'styles/css/login.css'],
                dest: 'dist/<%= pkg.name %>-login.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>-login.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/<%= pkg.name %>-login.min.css': ['<%= concat.css.dest %>']
                }
            }
        },
        jshint: {
            files: jsSrcs,
            options: {
                //这里是覆盖JSHint默认配置的选项
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        imagemin: { // Task
            static: { // Target
                options: { // Target options
                    optimizationLevel: 7,
                    svgoPlugins: [{
                            removeViewBox: false
                        }]
                        //,use: [mozjpeg()]
                },
                files: {
                    'dist/login-bg.jpg': 'styles/img/login-bg.jpg',
                    'dist/login-bg1922.jpg': 'styles/img/login-bg1922.jpg'
                }
            }
        },
        image: {
            static: {
                options: {
                    pngquant: true,
                    optipng: false,
                    zopflipng: true,
                    advpng: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    mozjpeg: true,
                    gifsicle: true,
                    svgo: true
                },
                files: {
                    'dist/login-bg.jpg': 'styles/img/login-bg.jpg',
                    'dist/login-bg1922.jpg': 'styles/img/login-bg1922.jpg'
                }
            }
        },
        sprite: {
            all: {
                src: ['styles/img/portlet-collapse-icon.png', 'styles/img/portlet-expand-icon.png', 'styles/img/portlet-reload-icon.png'],
                dest: 'dist/spritesheet.png',
                destCss: 'dist/sprites.css',
                algorithm: 'top-down'
            }
        },
        copy: {
            main: {
                expand: true,
                //src: 'styles/img/*',
                cwd: 'styles/img',
                src: '**',
                dest: 'dist/styles',
            },
        },
        clean: {
            build: {
                src: ['dist/styles']
            }
        },
        watch: {
            files: jsSrcs,
            tasks: ['jshint', 'concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('image-min', ['imagemin']);
    grunt.registerTask('image-min2', ['image']);
    grunt.registerTask('image-sprite', ['sprite']);
    grunt.registerTask('image-copy', ['copy']);
    grunt.registerTask('image-clean', ['clean']);
    grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

};
