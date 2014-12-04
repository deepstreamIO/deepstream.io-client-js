var derequire = require( 'derequire' );

module.exports = function(grunt) {

	var dereqCallback = function( err, src, next ) {
		if( err ) {
			throw err;
		}

		next( err, derequire( src ) );
	};

	grunt.initConfig({
		
		pkg: grunt.file.readJSON( 'package.json' ),

		browserify: {
			dist: {
				files: {
					'dist/deepstream.js': [ 'src/client.js' ]
				},
				options:{
					postBundleCB: dereqCallback,
					browserifyOptions: { 
						standalone: 'deepstream'
					}
				}
			},
			unit: {
				files: {
					'dist/deepstream.js': [ 'src/client.js' ]
				},
				options: {
					watch: true,
					postBundleCB: dereqCallback,
					browserifyOptions: { 
						standalone: 'deepstream'
					}
				}
			},
			live: {
				files: {
					'dist/deepstream.js': [ 'src/client.js' ]
				},
				options: {
					watch: true,
					keepAlive: true,
					postBundleCB: dereqCallback,
					browserifyOptions: { 
						standalone: 'deepstream'
					}
				}
			}
		},
		
		uglify: {
			dist: {
				files: {
					'dist/deepstream.min.js': [ 'dist/deepstream.js' ]
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			unitOnce: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
		
	});

	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-karma' );

	grunt.registerTask( 'dev', 'Browserifies the files on every change to src', [ 'browserify:live' ] );

	grunt.registerTask( 'build', 'Browserifies, tests and minifies the client file', [
		'browserify:dist',
		'karma:unitOnce',
		'uglify:dist'
	]);

	grunt.registerTask( 'unit', 'Runs unit tests in PhantomJS on every file change', [
		'browserify:unit',
		'karma:unit' 
	]);
	
	grunt.registerTask( 'default', [ 'build' ] );

};