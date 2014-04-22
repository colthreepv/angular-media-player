var hljs = require('highlight.js');

var markedOpts = {
  highlight: function (code, lang) {
    return hljs.highlightAuto(code).value;
  }
};

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // docs-only
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
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
          'README.md',
          'docs/layout',
          'docs/player.macro',
          'docs/*.swig',
          'docs/*.js',
          'docs/*.json',
          'docs/*.md',
          'docs/examples/*.swig',
          'docs/examples/*.js',
          'docs/examples/*.json',
          'docs/examples/*.md'
        ],
        tasks: ['clean:html', 'swig:development', 'copy:examples', 'clean:examples']
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
    clean: {
      'docs-readme': ['docs/docs.md'],
      'docs-md': ['docs/*.md.tpl.html', 'docs/examples/*.md.tpl.html'],
      'www': ['www/*'],
      'examples': ['www/examples'],
      'html': ['www/*.html', 'www/examples/*.html']
    },
    swig: {
      development: {
        files: [
          { cwd: 'docs/', src: '*.swig', dest: 'www/', expand: true },
          { cwd: 'docs/examples/', src: '*.swig', dest: 'www/', expand: true }
        ],
        siteDest: 'www/',
        generateSitemap: true,
        generateRobotstxt: true,
        siteUrl: 'http://mrgamer.github.io/angular-media-player/',
        tags: {
          highlight: require('swig-highlight'),
          markdown: require('swig-marked').configure(markedOpts).tag
        },
        sitemap_priorities: {
          'index.html': '0.8',
        },
        // local variables
        home: '/index.html'
      },
      github: {
        files: [
          { cwd: 'docs/', src: '*.swig', dest: 'www/', expand: true },
          { cwd: 'docs/examples/', src: '*.swig', dest: 'www/', expand: true }
        ],
        siteDest: 'www/',
        generateSitemap: true,
        generateRobotstxt: true,
        siteUrl: 'http://mrgamer.github.io/angular-media-player/',
        tags: {
          highlight: require('swig-highlight'),
          markdown: require('swig-marked').configure(markedOpts).tag
        },
        sitemap_priorities: {
          'index.html': '0.8',
        },
        // local variables
        home: '/index.html',
        urlPrefix: '/angular-media-player'
      }
    },
    copy: {
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
      },
      examples: {
        cwd: 'www/examples/',
        src: '*',
        dest: 'www/',
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
    'clean', 'copy', 'concat:devlib', 'swig:development', 'copy:examples', 'clean:examples', 'connect:docs', 'watch'
  ]);
  grunt.registerTask('build-docs', [
    'clean', 'copy', 'concat:devlib', 'swig:github', 'copy:examples', 'clean:examples'
  ]);
  grunt.registerTask('default', ['docs']);

};
