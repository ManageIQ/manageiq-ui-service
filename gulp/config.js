'use strict';

var merge = require('merge');

module.exports = (function() {
  var src = './';
  var client = src + 'client/';
  var server = src + 'server/';
  var tests = src + 'tests/';
  var build = '../manageiq/public/ui/service/';
  var manageiqDir = '../manageiq/';
  var temp = './.tmp/';
  var reports = './reports/';
  var nodeModules = './node_modules/';
  var styles = 'partials/styles.html';
  var javascripts = 'partials/javascripts.html';
  var config = {};

  /**
   * Files
   */
  var indexFileEjs = 'index.ejs';
  var indexFile = 'index.html';
  var specsFile = 'specs.html';
  var cssFile = 'styles.css';
  var sassFiles = [
    client + 'assets/sass/**/*.s+(a|c)ss',
    client + 'app/**/*.s+(a|c)ss'
  ];
  var templateFiles = client + 'app/**/*.html';
  var serverIntegrationSpecs = [tests + 'server-integration/**/*.spec.js'];
  var specHelperFiles = tests + 'test-helpers/*.js';

  var imageFiles = [
    client + 'assets/images/**/*.*'
  ];

  var fontFiles = [
    src + 'client/assets/fonts/**/*.*',
    nodeModules + 'font-awesome/fonts/**/*.*',
    nodeModules + 'patternfly/dist/fonts/**/*.*'
  ];

  var clientJsOrder = [
    '**/globals.js',
    '**/app.module.js',
    '**/*.module.js',
    '**/*.js'
  ];

  var serverApp = server + 'app.js';

  function getClientJsFiles(ordered, includeSpecs) {
    var files = [client + 'app/**/*.js', client + 'skin/**/*.js'];

    if (ordered) {
      files = [].concat(client + 'app/globals.js', client + 'app/app.module.js', client + 'app/**/*module*.js', files)
    }

    if (includeSpecs) {
      files = [].concat(files, tests + '**/*.spec.js');
      files = [].concat(files, {pattern: tests + 'mock/**/*.json', included: false});
    }

    return files;
  }

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        './node_modules/phantomjs-polyfill/bind-polyfill.js',
        './node_modules/jquery/dist/jquery.js',
        './node_modules/components-jqueryui/jquery-ui.min.js',
        './node_modules/jquery-match-height/dist/jquery.matchHeight.js',
        './node_modules/lodash/index.js',
        './node_modules/sprintf-js/src/sprintf.js',
        './node_modules/actioncable/lib/assets/compiled/action_cable.js',
        './node_modules/google-code-prettify/bin/prettify.min.js',
        './node_modules/toastr/toastr.js',

        './node_modules/d3/d3.js',
        './node_modules/c3/c3.js',

        './node_modules/datatables/media/js/jquery.dataTables.js',
        './node_modules/datatables-colreorder/js/dataTables.colReorder.js',
        './node_modules/datatables/media/js/jquery.dataTables.js',

        './node_modules/moment/moment.js',
        './node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
        './node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',

        './node_modules/es6-shim/es6-shim.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-animate/angular-animate.js',
        './node_modules/angular-cookies/angular-cookies.js',

        './node_modules/angular-resource/angular-resource.js',
        './node_modules/angular-messages/angular-messages.js',
        './node_modules/angular-mocks/angular-mocks.js',
        './node_modules/angular-sanitize/angular-sanitize.js',
        './node_modules/angular-base64/angular-base64.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        './node_modules/angular-dragdrop/src/angular-dragdrop.js',
        './node_modules/angular-gettext/dist/angular-gettext.js',
        './node_modules/angular-gettext/dist/angular-gettext.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './node_modules/bootstrap-combobox/js/bootstrap-combobox.min.js',
        './node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        './node_modules/bootstrap-select/dist/js/bootstrap-select.js',
        './node_modules/bootstrap-switch/dist/js/bootstrap-switch.js',
        './node_modules/bootstrap-touchspin/src/jquery.bootstrap-touchspin.js',
        './node_modules/angular-svg-base-fix/src/svgBaseFix.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js',
        './node_modules/patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.js',
        './node_modules/patternfly/dist/js/patternfly.js',
        './node_modules/angular-patternfly/dist/angular-patternfly.js',
        './node_modules/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
        './node_modules/ngprogress/build/ngProgress.js',
        './node_modules/ngstorage/ngStorage.js',

        './node_modules/bardjs/bard.js',
        './node_modules/sinon/pkg/sinon.js',
        './node_modules/karma-read-json/karma-read-json.js',
        specHelperFiles,
        getClientJsFiles(true, true),
        config.templatecache.build + config.templatecache.output,
        config.test.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        dir: reports + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          {type: 'html', subdir: 'report-html'},
          {type: 'lcov', subdir: 'report-lcov'},
          {type: 'text-summary'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[client + 'app/**/*.js'] = ['coverage'];

    return options;
  }

  // gulp-load-plugins options
  config.plugins = {
    lazy: true
  };

  // task ESLint: Runs ESLint on client code
  config.eslint = {
    src: getClientJsFiles(true, false)
  };

  // task sasslint: Runs sass-lint on client code
  config.sasslint = {
    src: sassFiles
  };
  //configures which directory manage iq server code is located
  config.manageiqDir = manageiqDir;
  // task clean: Directories to clean
  config.clean = {
    src: [
      build + '*',
      // report + '*',
      temp + '*'
    ]
  };

  config.cleanStyles = {
    src: [
      temp + '**/*.css',
      build + 'styles/**/*.css'
    ]
  };

  config.cleanFonts = {
    src: [build + 'fonts/**/*.*']
  };

  config.cleanImages = {
    src: [build + 'images/**/*.*']
  };

  config.cleanCode = {
    src: [
      temp + '**/*.js',
      build + 'js/**/*.js',
      build + '**/*.html'
    ]
  };

  // task images: Image build options
  config.images = {
    src: imageFiles,
    build: build + 'images',
    minify: true,
    options: {
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }
  };

  config.skinImages = {
    src: [
      client + 'skin/images/**/*.*'
    ],
    build: build + 'images',
    minify: true,
    options: {
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }
  };


  config.devImages = {
    src: imageFiles,
    build: temp + 'images',
    minify: false
  };

  config.devSkinImages = {
    src: [
      client + 'skin/images/**/*.*'
    ],
    build: temp + 'images',
    minify: false
  };

  config.imgs = {
    src: [
      nodeModules + 'patternfly/dist/img/**/*'
    ],
    build: build + 'img',
    minify: true,
    options: {
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }
  };

  config.devImgs = {
    src: [
      nodeModules + 'patternfly/dist/img/**/*'
    ],
    build: temp + 'img',
    minify: false
  };

  // task fonts: Copies fonts into build directory
  config.fonts = {
    src: fontFiles,
    build: build + 'fonts'
  };

  config.devFonts = {
    src: fontFiles,
    build: temp + 'fonts'
  };

  // task sass: Sass build options
  config.sass = {
    src: client + 'assets/sass/styles.sass',
    build: temp + 'styles/',
    output: cssFile,
    options: {
      outputStyle: 'compressed',
      precision: 8
    },
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 5%'
      ],
      cascade: true
    }
  };

  // task templatecache: Optimize templates
  config.templatecache = {
    src: templateFiles,
    build: temp,
    output: 'templates.js',
    minify: true, // Always minify the templates
    minifyOptions: {
      empty: true
    },
    templateOptions: {
      module: 'app.core',
      standalone: false,
      root: 'app/'
    }
  };

  // task inject: Inject CSS and JS into index.html
  // This task will also inject the application JavaScript
  // The inject task will inject the application CSS
  config.inject = {
    index: [client + javascripts, client + styles],
    build: client,
    temp: temp,
    files: getClientJsFiles(true, false),
    order: clientJsOrder
  };

  // task compile: Injects the application CSS (compiled from Sass) into index.html
  config.compile = {
    index: client + 'styles.html',
    build: client,
    css: [
      temp + 'styles/' + cssFile,
      client + '/skin/**/*.css'
    ]
  };

  config.optimize = {
    index: temp + indexFileEjs,
    build: build,
    cssFilter: '.tmp/styles/*.css',
    appJsFilter: '.tmp/js/app.js',
    libJsFilter: '.tmp/js/lib.js',
    templateCache: config.templatecache.build + config.templatecache.output,
    ngAnnotateOptions: {
      single_quotes: true
    },
    devHost: 'http://localhost:3000'
  };

  // task compileEjs: Injects javascripts.html and styles.html into build index.html
  config.ejs = {
    index: client + indexFileEjs,
    build: temp
  };

  config.build = {
    clean: temp
  };

  config.test = {
    confFile: __dirname + '/../karma.conf.js',
    serverEnv: 'dev',
    serverPort: 8888,
    serverApp: serverApp,
    serverIntegrationSpecs: serverIntegrationSpecs
  };

  config.karma = getKarmaOptions();

  config.serve = {
    serverApp: serverApp,
    serverPort: process.env.PORT || '8001',
    watch: [server],
    browserReloadDelay: 1000,
    specsFile: specsFile,
    sass: sassFiles,
    js: getClientJsFiles(true, false),
    html: [].concat(client + indexFileEjs, templateFiles),
    devFiles: [
      client + '**/*.js',
      client + '**/*.html',
      temp + '**/*.css'
    ],
    browserSyncOptions: {
      proxy: {
        target: 'localhost:' + (process.env.PORT || '8001'),
        ws: true,
      },
      port: 3001,
      startPath: '/ui/service/',
      files: [],
      ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: 'debug',
      logPrefix: 'angular-gulp-sass-inject',
      notify: true,
      reloadDelay: 0
    }
  };

  config.availableLanguages = {
    catalogs: 'client/gettext/json/*/*.json',
    availLangsFile: 'client/gettext/json/available_languages.json',
    supportedLangsFile: 'client/gettext/json/supported_languages.json'
  };

  var poDir = 'client/gettext/po/';

  config.gettextExtract = {
    inputs: ['client/**/*.js', 'client/**/*.html'],
    potFile: 'manageiq-ui-service.pot',
    extractorOptions: {
      markerNames: ['__', 'N_'],
    },
    outputDir: poDir,
  };

  config.gettextCompile = {
    inputs: poDir + '**/*.po',
    compilerOptions: {
      format: 'json',
    },
    outputDir: 'client/gettext/json/',
  };

  config.gettextCopy = {
    inputs: ['client/gettext/json/**/*.json', config.availableLanguages.availLangsFile],
    outputDir: build + 'gettext/json/',
  };

  config.consoleCopy = [
    {
      input: nodeModules + 'no-vnc/**/*',
      output: build + 'vendor/no-vnc',
    },
    {
      input: nodeModules + 'spice-html5-bower/**/*',
      output: build + 'vendor/spice-html5-bower',
    },
  ];

  // task bump: Revs the package files
  config.bump = {
    packages: [
      './package.json',
    ],
    root: './'
  };

  return config;
})();
