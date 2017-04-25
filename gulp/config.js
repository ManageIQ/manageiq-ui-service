'use strict';

module.exports = (function() {
  var poDir = 'client/gettext/po/';
  var config = {};

  config.availableLanguages = {
    catalogs: 'client/gettext/json/*/*.json',
    availLangsFile: 'client/gettext/json/available_languages.json',
    supportedLangsFile: 'client/gettext/json/supported_languages.json',
  };

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
