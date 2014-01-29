var hljs = require('highlight.js'),
    XML = require('xml');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // docs-only
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-md2html');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html-snapshot');

  var docUrls = [
    { loc: '#!/', priority: 1 },
    '#!/populate-playlist',
    '#!/progressive-playlist',
    '#!/swap-playlist',
    '#!/interactive-demo',
    '#!/repeat-audio'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%=pkg.name %> v<%=pkg.version %> | date: <%=grunt.template.today("dd-mm-yyyy") %> */\n'
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
        options: {
          banner: '/*! <%=pkg.name %> v<%=pkg.version %> | date: <%=grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        src: ['src/directive.js', 'src/helpers.js'],
        dest: 'dist/angular-audio-player.js'
      }
    },
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      'docs-app': {
        src: [
          'docs/docs.js',
          'docs/examples/*.js'
        ],
        dest: 'docs/app.js'
      },
      'docs-libs': {
        src: [
          'libs/angular/angular.js',
          'libs/angular-route/angular-route.js',
          'libs/angular-animate/angular-animate.js',
          'libs/angular-dragdrop/draganddrop.js',
          'dist/angular-audio-player.js'
        ],
        dest: 'docs/libs.js'
      }
    },
    watch: {
      // options : {
      //   atBegin: true
      // },
      // source: {
      //   options: {
      //     atBegin: true
      //   },
      //   files: ['src/directive.js', 'src/helpers.js'],
      //   tasks: ['concat', 'saveRevision', 'uglify']
      // },
      'docs-app': {
        files: [
          'docs/docs.js',
          'docs/examples/*.js'
        ],
        tasks: ['concat_sourcemap:docs-app']
      },
      'docs-tpl': {
        files: [
          'docs/**/*.tpl.html',
          'docs/*.tpl.html'
        ],
        tasks: ['html2js:docs']
      },
      'docs-md': {
        files: [
          'docs/*.md',
          'docs/examples/*.md'
        ],
        tasks: ['md2html', 'html2js:docs']
      }
    },
    connect: {
      docs: {
        options: {
          port: 8181,
          base: 'docs/',
          hostname: '*',
          debug: true
        }
      }
    },
    html2js: {
      docs: {
        options: {
          base: 'docs'
        },
        src: [
          'docs/**/*.tpl.html',
          'docs/*.tpl.html'
        ],
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
          markedOptions: {
            highlight: function (code, lang) {
              return hljs.highlightAuto(code).value;
            }
          }
        }
      }
    },
    clean: {
      'docs-libs': ['docs/libs.js'],
      'docs-app': ['docs/app.js'],
      'docs-tpl': ['docs/templates-docs.js'],
      'docs-md': ['docs/*.md.tpl.html', 'docs/examples/*.md.tpl.html'],
      'docs-prerender': ['docs/prerender-*.html'],
      'docs-sitemap': ['docs/sitemap.xml']
    },
    htmlSnapshot: {
      docs: {
        options: {
          snapshotPath: 'docs/',
          sitePath: 'http://localhost:8181/',
          fileNamePrefix: 'prerender-',
          sanitize: function (requestUri) {
            return requestUri.replace(/\/|\#|\!/g, '');
          },
          removeScripts: true,
          removeLinkTags: true,
          urls: docUrls.map(function (docPage) { return (typeof docPage === 'object') ? docPage.loc : docPage; })
        }
      }
    }
  });

  grunt.registerTask('sitemap', function () {
    var sitemapJson,
        baseUrl = 'http://aap.col3.me/';
    sitemapJson = {
      urlset: [{ _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } }]
    };

    docUrls.forEach(function (docPage, index) {
      var priority, pageUrl;
      if (typeof docPage === 'object') {
        pageUrl = docPage.loc;
        priority = (docPage.priority) ? docPage.priority.toString(2) : '0.5';
      } else {
        pageUrl = docPage;
        priority = '0.5';
      }

      sitemapJson.urlset.push(
      {
        url: [
          { loc: baseUrl + pageUrl },
          { lastmod: grunt.template.today("yyyy-mm-dd") },
          { changefreq: 'daily' },
          { priority: priority }
        ]
      });
    });

    grunt.file.write('docs/sitemap.xml', XML(sitemapJson, { declaration: true, indent: '  ' }));
  });

  grunt.registerTask('build', ['jshint:source', 'concat', 'uglify']);
  grunt.registerTask('default', ['connect', 'watch']);

  // docs building
  // - clean folder
  // - jshint documentation
  // - concatenate libraries for documentation
  // - concatenate documentation app
  // - convert markdown to html partials
  // - convert all html partials to one .js file
  // - start connect fileserver
  // - take an HTML snapshot of the pages
  // - put yourself on watch for changes
  grunt.registerTask('docs', [
    'clean', 'jshint:docs', 'concat_sourcemap:docs-libs', 'concat_sourcemap:docs-app', 'md2html', 'html2js:docs', 'connect:docs', 'sitemap', 'htmlSnapshot', 'watch'
  ]);

};
