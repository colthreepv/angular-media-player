module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['src/angular-audio-player.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js', 'src/*.spec.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: false,
          console: true,
          module: true,
          document: true
        }
      }
    },
    karma: {
      unit: {
        configFile: './karma.config.js',
        autoWatch: true
      }
    }
  });

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'uglify']);

};
