/* eslint-disable global-require */

'use strict'

const glob = require('glob')
const fs = require('fs')

task()

function task () {
  const config = {
    catalogs: '../client/gettext/json/manageiq-ui-service.json',
    availLangsFile: '../client/gettext/json/available_languages.json',
    supportedLangsFile: '../client/gettext/json/supported_languages.json'
  }

  const langFile = glob.sync(config.catalogs)
  let availableLanguages = {}
  let supportedLanguages = []

  if (fs.existsSync(config.supportedLangsFile)) {
    supportedLanguages = JSON.parse(fs.readFileSync(config.supportedLangsFile, 'utf8'))
  }

  const catalog = JSON.parse(fs.readFileSync(langFile[0], 'utf8'))

  for (const propName in catalog) {
    if (typeof (catalog[propName]) !== 'undefined') {
      // If we have a list of supported languages and the language is not on the list, we skip it
      if (supportedLanguages.length > 0 && !supportedLanguages.includes(propName)) {
        continue
      }

      if (typeof (catalog[propName].locale_name) !== 'undefined') {
        availableLanguages[propName] = catalog[propName].locale_name
      } else {
        availableLanguages[propName] = ''
      }
    }
  }

  availableLanguages = JSON.stringify(availableLanguages)
  fs.writeFileSync(config.availLangsFile, availableLanguages, {encoding: 'utf-8', flag: 'w+'})
}
