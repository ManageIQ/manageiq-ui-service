'use strict';

module.exports = (function() {
  var client = './client/';
  var config = {};

  //configures which directory manage iq server code is located
  config.manageiqDir = '../manageiq/';

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

  return config;
})();
