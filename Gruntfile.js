module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-git-describe');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%=git %> | date: <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
        // Settings
        "passfail"      : false,  // Stop on first error.
        "maxerr"        : 10000,    // Maximum error before stopping.


        // Predefined globals whom JSHint will ignore.
        "browser"       : true,   // Standard browser globals e.g. `window`, `document`.

        "node"          : false,
        "rhino"         : false,
        "couch"         : false,
        "wsh"           : false,   // Windows Scripting Host.

        "jquery"        : true,
        "prototypejs"   : false,
        "mootools"      : false,
        "dojo"          : false,

        //"predef"        : [  // Custom globals.],


        // Development.
        "debug"         : false,  // Allow debugger statements e.g. browser breakpoints.
        "devel"         : false,   // Allow developments statements e.g. `console.log();`.


        // ECMAScript 5.
        "strict"        : false,  // Require `use strict` pragma  in every file.
        "globalstrict"  : false,  // Allow global "use strict" (also enables 'strict').


        // The Good Parts.
        "asi"           : false,  // Tolerate Automatic Semicolon Insertion (no semicolons).
        "laxbreak"      : true,   // Tolerate unsafe line breaks e.g. `return [\n] x` without semicolons.
        "bitwise"       : false,  // Prohibit bitwise operators (&, |, ^, etc.).
        "boss"          : false,  // Tolerate assignments inside if, for & while. Usually conditions & loops are for comparison, not assignments.
        "curly"         : true,   // Require {} for every new block or scope.
        "eqeqeq"        : true,   // Require triple equals i.e. `===`.
        "eqnull"        : false,  // Tolerate use of `== null`.
        "evil"          : false,  // Tolerate use of `eval`.
        "expr"          : false,  // Tolerate `ExpressionStatement` as Programs.
        "forin"         : false,  // Tolerate `for in` loops without `hasOwnPrototype`.
        "immed"         : true,   // Require immediate invocations to be wrapped in parens e.g. `( function(){}() );`
        "latedef"       : true,   // Prohibit variable use before definition.
        "loopfunc"      : false,  // Allow functions to be defined within loops.
        "noarg"         : true,   // Prohibit use of `arguments.caller` and `arguments.callee`.
        "regexp"        : true,   // Prohibit `.` and `[^...]` in regular expressions.
        "regexdash"     : false,  // Tolerate unescaped last dash i.e. `[-...]`.
        "scripturl"     : true,   // Tolerate script-targeted URLs.
        "shadow"        : false,  // Allows re-define variables later in code e.g. `var x=1; x=2;`.
        "supernew"      : false,  // Tolerate `new function () { ... };` and `new Object;`.
        "undef"         : false,  // Require all non-global variables be declared before they are used.

        // Personal styling preferences.
        "newcap"        : true,   // Require capitalization of all constructor functions e.g. `new F()`.
        "noempty"       : true,   // Prohibit use of empty blocks.
        "nonew"         : true,   // Prohibit use of constructors for side-effects.
        "nomen"         : false,  // Prohibit use of initial or trailing underbars in names.
        "onevar"        : false,  // Allow only one `var` statement per function.
        "plusplus"      : false,  // Prohibit use of `++` & `--`.
        "sub"           : false,  // Tolerate all forms of subscript notation besides dot notation e.g. `dict['key']` instead of `dict.key`.
        "trailing"      : true,   // Prohibit trailing whitespaces.
        "white"         : true,   // Check against strict whitespace and indentation rules.
        "indent"        : 2,      // Specify indentation spacing
        "laxcomma"      : true
      }
    },
    karma: {
      unit: {
        configFile: './karma.config.js',
        autoWatch: true
      }
    },
    "git-describe": {
      version: {
        options: {
          prop: 'git'
        }
      }
    }
  });

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'git-describe', 'uglify']);

};
