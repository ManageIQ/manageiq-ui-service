/* eslint-disable no-console, angular/log, no-process-exit, global-require */
const fs = require('fs')
const path = require('path')
const args = process.argv
let action = ''
let config = {}
const zanata = require('./zanata')
const configFile = path.join(__dirname, '../zanata.local.json')
const availableLanguages = require('../client/gettext/json/available_languages.json')
const languages = setLanguages(availableLanguages)
/**
 * Sample Zanata config file
 * {
    "apiKey":"",
    "project":"",
    "version":"",
    "user":""
}
 */
if (fs.existsSync(configFile)) {
  config = require(configFile)
} else {
  if (!process.env.apiKey) {
    console.log('Please set env variables or create config file')
    process.exit(1)
  } else {
    config.apiKey = process.env.zanataApiKey
    config.project = process.env.zanataProject
    config.version = (process.env.TRAVIS_BRANCH ? process.env.TRAVIS_BRANCH : process.env.zanataVersion)
    config.user = process.env.zantaUser
  }
}
zanata.setConfig(config)

if (args.length < 3) {
  console.log('Did not specify the correct number of args')
  process.exit(1)
} else {
  action = args[2]
}

if (action === 'upload') {
  const potFile = path.join(__dirname, '../client/gettext/po/manageiq-ui-service.pot')
  zanata.upload(potFile)
} else if (action === 'download') {
  console.log('Downloading Files')
  const outputDir = path.join(__dirname, '../client/gettext/po/')

  zanata.download(languages, outputDir)
}

function setLanguages (languageList) {
  const tmpLanguages = []
  for (var key in languageList) {
    tmpLanguages.push(key)
  }

  return tmpLanguages
}
