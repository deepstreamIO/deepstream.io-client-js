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
					browserifyOptions: {
						standalone: 'deepstream',
						// insertGlobalVars: 'global',
						// detectGlobals: false
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
						standalone: 'deepstream',
						// insertGlobalVars: 'global',
						// detectGlobals: false
					}
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> (c)<%= grunt.template.today("yyyy") %> hoxton-one, with parts (c)<%= grunt.template.today("yyyy") %> Joyent and contributers  @licence <%= pkg.license %>*/\n'
			},
			dist: {
				files: {
					'dist/deepstream.min.js': [ 'dist/deepstream.js' ]
				}
			}
		},
		exec: {
			runUnitTests: 'node node_modules/jasmine-node/lib/jasmine-node/cli.js test-unit --autotest --watch ./src',
			runUnitTestsOnce: 'node node_modules/jasmine-node/lib/jasmine-node/cli.js test-unit --forceexit'
		},
		_release: {
			options: {
				beforeBump: [ 'build' ],
				additionalFiles: [ 'bower.json' ],
				github: {
					repo: 'hoxton-one/deepstream.io-client-js',
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

	grunt.registerTask( 'build', 'Browserifies, tests and minifies the client file', [
		'browserify:dist',
		'exec:runUnitTestsOnce',
		'uglify:dist'
	] );

	grunt.registerTask( 'default', [ 'build' ] );
	grunt.registerTask( 'release', [ 'build', '_release' ] );

};
