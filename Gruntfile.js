var hljs = require('highlight.js');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // docs-only
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-md2html');
  grunt.loadNpmTasks('grunt-swig');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        src: 'dist/angular-media-player.js',
        dest: 'dist/angular-media-player.min.js'
      }
    },
    concat: {
      library: {
        src: ['src/directive.js', 'src/helpers.js'],
        dest: 'dist/angular-media-player.js'
      },
      devlib: {
        src: ['src/directive.js', 'src/helpers.js'],
        dest: 'www/libs/angular-media-player.js'
      }
    },
    watch: {
      docs: {
        files: [
          'docs/*.swig',
          'docs/*.js',
          'docs/*.json',
          'docs/*.md',
          'docs/examples/*.swig',
          'docs/examples/*.js',
          'docs/examples/*.json',
          'docs/examples/*.md'
        ],
        tasks: ['clean:html', 'swig']
      },
      library: {
        files: ['src/*'],
        tasks: ['concat:devlib']
      },
      css: {
        files: ['docs/style.css'],
        tasks: ['copy:css']
      }
    },
    connect: {
      docs: {
        options: {
          port: 8181,
          base: 'www/',
          hostname: '*',
          debug: true
        }
      }
    },
    md2html: {
      docs: {
        files: [
          { cwd: 'docs/', src: ['docs.md'], dest: 'docs/', ext: '.md.tpl.html', expand: true }
        ],
        options: {
          markedOptions: {
            highlight: function (code, lang) {
              return hljs.highlightAuto(code).value;
            }
          }
        }
      }
    },
    clean: {
      'docs-readme': ['docs/docs.md'],
      'docs-md': ['docs/*.md.tpl.html', 'docs/examples/*.md.tpl.html'],
      'www': ['www/*'],
      'html': ['www/*.html', 'www/examples/*.html']
    },
    swig: {
      development: {
        // init: {
        //   autoescape: true
        // },
        src: ['docs/*.swig', 'docs/examples/*.swig'],
        dest: 'www/',
        generateSitemap: true,
        generateRobotstxt: true,
        siteUrl: 'http://mrgamer.github.io/angular-media-player/',
        tags: {
          highlight: require('swig-highlight')
        },
        sitemap_priorities: {
          'index.html': '0.8',
        },
        // local variables
        home: '/index.html',
        production: false
      }
    },
    copy: {
      readme: {
        src: 'README.md',
        dest: 'docs/docs.md'
      },
      css: {
        src: 'docs/style.css',
        dest: 'www/style.css'
      },
      dragdrop: {
        src: 'libs/angular-dragdrop/draganddrop.js',
        dest: 'www/libs/angular-dragdrop.js'
      },
      cssribbon: {
        cwd: 'libs/github-fork-ribbon-css/',
        src: '*.css',
        dest: 'www/libs/github-fork-ribbon-css/',
        expand: true
      }
    }
  });

  grunt.registerTask('build', ['concat:library', 'uglify']);
  // docs building
  // - clean folder
  // - convert markdown to html partials
  // - copy libraries from libs/ to www/libs/
  // - compile media-player library in www/libs/
  // - compile documentation from docs/*.swig to www/*.html
  // - start connect static fileserver
  // - put yourself on watch for changes
  grunt.registerTask('docs', [
    'clean', 'copy:readme', 'md2html:docs', 'copy', 'concat:devlib', 'swig', 'connect:docs', 'watch'
  ]);
  grunt.registerTask('default', ['docs']);

};
