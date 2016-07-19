var derequire = require( 'derequire' );

module.exports = function( grunt ) {

	var dereqCallback = function( err, src, next ) {
		if( err ) {
			throw err;
		}

		next( err, derequire( src ) );
	};

	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		browserify: {
			dist: {
				files: {
					'dist/deepstream.js': [ 'src/client.js' ]
				},
				options: {
					postBundleCB: dereqCallback,
					ignore: [ './src/tcp/tcp-connection.js' ],
					browserifyOptions: {
						standalone: 'deepstream',
						//'builtins': []
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
					ignore: [ './src/tcp/tcp-connection.js' ],
					browserifyOptions: {
						standalone: 'deepstream',
					}
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> (c)<%= grunt.template.today("yyyy") %> deepstreamHub GmbH, with parts (c)<%= grunt.template.today("yyyy") %> Joyent and contributers  @licence <%= pkg.license %>*/\n'
			},
			dist: {
				files: {
					'dist/deepstream.min.js': [ 'dist/deepstream.js' ]
				}
			}
		},
		exec: {
			runUnitTests: 'npm run-script watch',
			runUnitTestsOnce: 'npm test'
		},
		_release: {
			options: {
				beforeBump: [ 'build' ],
				additionalFiles: [ 'bower.json' ],
				github: {
					repo: 'deepstreamIO/deepstream.io-client-js',
					usernameVar: 'GITHUB_USERNAME',
					passwordVar: 'GITHUB_PASSWORD'
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-exec' );
	grunt.loadNpmTasks( 'grunt-release' );
	grunt.renameTask( 'release', '_release' );
	grunt.registerTask( 'dev', 'Browserifies the files on every change to src', [ 'browserify:live' ] );
	grunt.registerTask( 'test-unit', [ 'exec:runUnitTests' ] );
	grunt.registerTask( 'just-build', 'Browserifies, tests and minifies the client file', [
		'browserify:dist',
		'uglify:dist'
	] );
	grunt.registerTask( 'build', 'Browserifies, tests and minifies the client file', [
		'browserify:dist',
		'exec:runUnitTestsOnce',
		'uglify:dist'
	] );

	grunt.registerTask( 'default', [ 'build' ] );
	grunt.registerTask( 'release', [ 'build', '_release' ] );

};
