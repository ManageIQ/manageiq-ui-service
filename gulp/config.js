'use strict';

module.exports = (function() {
  var src = './';
  var client = src + 'client/';
  var server = src + 'server/';
  var tests = src + 'tests/';
  var manageiqDir = '../manageiq/';
  var temp = './.tmp/';
  var reports = './reports/';
  var nodeModules = './node_modules/';
  var config = {};

  /**
   * Files
   */
  var templateFiles = client + 'app/**/*.html';
  var specHelperFiles = tests + 'test-helpers/*.js';

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
        './node_modules/manageiq-ui-components/dist/js/ui-components.js',
        specHelperFiles,
        getClientJsFiles(true, true),
        config.templatecache.build + config.templatecache.output,
        {pattern: './client/assets/images/**/*.*', watched: false, included: false, served: true, nocache: false}
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
      preprocessors: {
        'client/app/**/*.js': ['babel', 'coverage'],
        'tests/**/*.js': ['babel'],
      },
    };

    return options;
  }

  //configures which directory manage iq server code is located
  config.manageiqDir = manageiqDir;

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

  config.test = {
    confFile: __dirname + '/../karma.conf.js',
    serverEnv: 'dev',
    serverPort: 8888,
    serverApp: serverApp,
  };

  config.karma = getKarmaOptions();

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

  // task bump: Revs the package files
  config.bump = {
    packages: [
      './package.json',
    ],
    root: './'
  };

  return config;
})();
