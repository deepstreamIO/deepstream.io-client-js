module.exports = function(grunt) {


	grunt.initConfig({
		
		pkg: grunt.file.readJSON( 'package.json' ),

		concat: {
			dist: {
				src: [ 'src/**/*' ],
				dest: 'dist/deepstream.js',
			}
		},

		wrap: {
			dist: {
				src: [ 'dist/deepstream.js' ],
				dest: 'dist/deepstream.js',
				options: {
					wrapper: ['(function() {\n', '\n})();']
				}
			},
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

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-wrap' );
	grunt.loadNpmTasks( 'grunt-karma' );

	grunt.registerTask( 'build', [
		'karma:unitOnce',
		'concat:dist',
		'wrap:dist',
		'uglify:dist'
	]);

	grunt.registerTask( 'unit', [ 'karma:unit' ] );
	grunt.registerTask( 'default', [ 'build' ] );

};