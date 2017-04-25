/* eslint-disable angular/definedundefined, angular/json-functions, global-require */

'use strict';

var glob = require('glob');
var fs = require('fs');
var log = require('../utils/log');

module.exports = function(_gulp, options) {
  var config = require('../config')[options.key || 'availableLanguages'];

  return task;

  function task() {
    if (options.verbose) {
      log('Creating list of available languages under client/gettext/json');
    }

    var langFiles = glob.sync(config.catalogs);
    var availableLanguages = {};
    var supportedLanguages = [];

    if (fs.existsSync(config.supportedLangsFile)) {
      supportedLanguages = JSON.parse(fs.readFileSync(config.supportedLangsFile, 'utf8'));
    }

    langFiles.forEach(function(item, _index) {
      var catalog = JSON.parse(fs.readFileSync(item, 'utf8'));

      for (var propName in catalog) {
        if (typeof(catalog[propName]) !== 'undefined') {
          // If we have a list of supported languages and the language is not on the list, we skip it
          if (supportedLanguages.length > 0 && !supportedLanguages.includes(propName)) {
            continue;
          }

          if (typeof(catalog[propName].locale_name) !== 'undefined') {
            availableLanguages[propName] = catalog[propName].locale_name;
          } else {
            availableLanguages[propName] = '';
          }
        }
      }
    });

    availableLanguages = JSON.stringify(availableLanguages);
    fs.writeFileSync(config.availLangsFile, availableLanguages, {encoding: 'utf-8', flag: 'w+'});
  }
};
