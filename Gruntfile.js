var hljs = require('highlight.js');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-git-describe');
  // docs grunt-requirements
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-md2html');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%=grunt.option("gitRevision") %> | date: <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        src: 'dist/angular-audio-player.js',
        dest: 'dist/angular-audio-player.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      source: ['Gruntfile.js', 'src/*.js'],
      docs: ['docs/*.js', 'docs/examples/*.js']
    },
    karma: {
      unit: {
        configFile: './karma.config.js',
        autoWatch: true
      }
    },
    'git-describe': {
      all: {}
    },
    concat: {
      source: {
        src: ['src/directive.js', 'src/helpers.js'],
        dest: 'dist/angular-audio-player.js'
      },
      docs: {
        files: [
          {
            src: [
              'docs/*.js',
              'docs/examples/*.js'
            ],
            dest: 'docs/app.js'
          },
          {
            src: [
              'docs/libs/angular/angular.js',
              'docs/libs/angular-route/angular-route.js',
              'docs/libs/angular-animate/angular-animate.js',
            ],
            dest: 'docs/libs.js'
          }
        ]
      }
    },
    watch: {
      source: {
        options: {
          atBegin: true
        },
        files: ['src/directive.js', 'src/helpers.js'],
        tasks: ['concat', 'saveRevision', 'uglify']
      }
    },
    connect: {
      docs: {
        options: {
          port: 8181,
          base: 'docs/',
          hostname: '*',
          debug: true,
          keepalive: true
        }
      }
    },
    html2js: {
      docs: {
        options: {
          base: 'docs'
        },
        src: ['docs/**/*.tpl.html', 'docs/*.tpl.html'],
        dest: 'docs/templates-docs.js'
      }
    },
    md2html: {
      docs: {
        files: [
          { src: ['docs/*.md'], dest: '', ext: '.md.tpl.html', expand: true },
          { src: ['docs/examples/*.md'], dest: '', ext: '.md.tpl.html', expand: true }
        ],
        options: {
          template: 'docs/markdown.template.jst',
          markedOptions: {
            highlight: function (code, lang) {
              return hljs.highlightAuto(code).value;
            }
          }
        }
      }
    },
    clean: {
      docs: {
        src: [
          'docs/*.md.tpl.html',
          'docs/examples/*.md.tpl.html',
          'docs/templates-docs.js',
          'docs/app.js',
          'docs/libs.js'
        ]
      }
    }
  });

  grunt.registerTask('saveRevision', function () {
    grunt.event.once('git-describe', function (rev) {
      grunt.option('gitRevision', rev);
    });
    grunt.task.run('git-describe');
  });

  grunt.registerTask('test', ['jshint', 'karma']);
  grunt.registerTask('build', ['jshint', 'saveRevision', 'concat', 'uglify']);
  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('docs', ['clean:docs', 'concat:docs', 'md2html', 'html2js', 'connect:docs']);

};
