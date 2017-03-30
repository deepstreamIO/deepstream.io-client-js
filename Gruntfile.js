const derequire = require('derequire')

function dereqCallback(err, src, next) {
  if(err) {
    throw err
  }
  next(err, derequire(src))
}

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'dist/deepstream.js': [ 'src/client.js' ]
        },
        options: {
          transform: [['babelify', {presets: ['es2015']}]],
          postBundleCB: dereqCallback,
          ignore: [ 'ws' ],
          browserifyOptions: {
            standalone: 'deepstream',
            //'builtins': []
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
    }
  })

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.registerTask('test-unit', [ 'exec:runUnitTests' ])
  grunt.registerTask('just-build', 'Browserifies, tests and minifies the client file', [
    'browserify:dist',
    'uglify:dist'
  ])
  grunt.registerTask('build', 'Browserifies, tests and minifies the client file', [
    'browserify:dist',
    'uglify:dist'
  ])

  grunt.registerTask('default', [ 'build' ])
}
