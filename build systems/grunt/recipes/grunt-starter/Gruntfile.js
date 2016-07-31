'use strict';
module.exports = function (grunt) {
	// load all grunt tasks matching the `grunt-*` pattern
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		// get the configuration info from package.json ----
		// this way we can use things like name and version (pkg.name)
		pkg : grunt.file.readJSON('package.json'),

		bower : {
			install : {
				options : {
					targetDir : './assets'
				}
			}
		},
		copy : {
			main : {
				files : [// move the fontawesome font files 
					{
						expand : true,
						flatten : true,
						src : ['assets/fontawesome/fonts/**'],
						dest : 'dist/fonts/',
						filter : 'isFile'
					}
				]
			}
		},
		// watch for changes and trigger sass, jshint, and uglify
		watch : {
			sass : {
				files : ['assets/styles/**/*.{scss,sass}'],
				tasks : ['sass', 'cssmin']
			},
			js : {
				files : '<%= jshint.all %>',
				tasks : ['jshint', 'uglify']
			},
			images : {
				files : ['assets/img/*.{png,jpg,gif}'],
				tasks : ['imagemin']
			},
			files : '**/**.php',
		},
		// sass
		sass : {
			dist : {
				options : {
					style : 'expanded',
				},
				files : {
					'dist/styles/style.css' : 'assets/styles/style.scss'
				}
			}
		},
		// css minify
		cssmin : {
			build : {
				files : {
					'dist/styles/style.min.css' : 'dist/styles/style.css'
				}
			}
		},

		// javascript linting with jshint
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				"force" : true
			},
			all : ['Gruntfile.js', 'assets/js/**/*.js']
		},
		//uglify to concat & minify
		uglify : {
			main : {
				options : {
					banner : '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
				},
				files : {
					'dist/js/main.min.js' : ['assets/js/**/*.js', 'assets/bootstrap-sass-official/assets/javascripts/bootstrap.js']
				}
			}
		},
		// image optimization
		imagemin : {
			dist : {
				options : {
					optimizationLevel : 7,
					progressive : true,
					interlaced : true
				},
				files : [
					{
						expand : true,
						cwd : 'assets/img/',
						src : ['**/*.{png,jpg,gif}'],
						dest : 'dist/img/'
					}
				]
			}
		},
		// deploy via rsync
		deploy : {
			options : {
				src : ". /",
				args : ["—verbose"],
				exclude : ['.git*', 'node_modules', '.sass-cache', 'Gruntfile.js', 'package.json', '.DS_Store', 'README.md', 'config.rb', '.jshintrc', 'bower.json', '.bowerrc'],
				recursive : true,
				syncDestIgnoreExcl : true
			},
			staging : {
				options : {
					dest : "~/path/to/site",
					host : "user @ host.com"
				}
			},
			production : {
				options : {
					dest : "~/path/to/site",
					host : "user @ host.com"
				}
			}
		}
	});
	// rename tasks
	grunt.renameTask('rsync', 'deploy');
	// register tasks
	grunt.registerTask('start', ['bower', 'copy']);
	grunt.registerTask('devel', ['sass', 'cssmin', 'uglify', 'imagemin', 'jshint', 'watch']);
};