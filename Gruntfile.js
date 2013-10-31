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
      files: ['Gruntfile.js', 'src/*.js', 'src/*.spec.js'],
      options: {
        // options here to override JSHint defaults
        // Settings
        'passfail'      : false,  // Stop on first error.
        'maxerr'        : 10000,    // Maximum error before stopping.

        // Development.
        'debug'         : false,  // Allow debugger statements e.g. browser breakpoints.
        'devel'         : false,   // Allow developments statements e.g. `console.log();`.


        // ECMAScript 5.
        'strict'        : false,  // Require `use strict` pragma  in every file.
        'globalstrict'  : false,  // Allow global 'use strict' (also enables 'strict').


        // The Good Parts.
        'asi'           : false,  // Tolerate Automatic Semicolon Insertion (no semicolons).
        'laxbreak'      : true,   // Tolerate unsafe line breaks e.g. `return [\n] x` without semicolons.
        'bitwise'       : false,  // Prohibit bitwise operators (&, |, ^, etc.).
        'boss'          : false,  // Tolerate assignments inside if, for & while. Usually conditions & loops are for comparison, not assignments.
        'curly'         : true,   // Require {} for every new block or scope.
        'eqeqeq'        : true,   // Require triple equals i.e. `===`.
        'eqnull'        : false,  // Tolerate use of `== null`.
        'evil'          : false,  // Tolerate use of `eval`.
        'expr'          : false,  // Tolerate `ExpressionStatement` as Programs.
        'forin'         : false,  // Tolerate `for in` loops without `hasOwnPrototype`.
        'immed'         : true,   // Require immediate invocations to be wrapped in parens e.g. `( function(){}() );`
        'latedef'       : true,   // Prohibit variable use before definition.
        'loopfunc'      : false,  // Allow functions to be defined within loops.
        'noarg'         : true,   // Prohibit use of `arguments.caller` and `arguments.callee`.
        'regexp'        : true,   // Prohibit `.` and `[^...]` in regular expressions.
        'regexdash'     : false,  // Tolerate unescaped last dash i.e. `[-...]`.
        'scripturl'     : true,   // Tolerate script-targeted URLs.
        'shadow'        : false,  // Allows re-define variables later in code e.g. `var x=1; x=2;`.
        'supernew'      : false,  // Tolerate `new function () { ... };` and `new Object;`.
        'undef'         : false,  // Require all non-global variables be declared before they are used.

        // Personal styling preferences.
        'newcap'        : true,   // Require capitalization of all constructor functions e.g. `new F()`.
        'noempty'       : true,   // Prohibit use of empty blocks.
        'nonew'         : true,   // Prohibit use of constructors for side-effects.
        'nomen'         : false,  // Prohibit use of initial or trailing underbars in names.
        'onevar'        : false,  // Allow only one `var` statement per function.
        'plusplus'      : false,  // Prohibit use of `++` & `--`.
        'sub'           : false,  // Tolerate all forms of subscript notation besides dot notation e.g. `dict['key']` instead of `dict.key`.
        'trailing'      : true,   // Prohibit trailing whitespaces.
        'white'         : true,   // Check against strict whitespace and indentation rules.
        'indent'        : 2       // Specify indentation spacing
      }
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
