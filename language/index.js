const exec = require('child_process').exec;
const fs = require('fs'), path = require('path')
const args = process.argv
let action = ''
let config= {}
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
//get env variables set
  if (!process.env.apiKey){
    console.log("Please set env variables or create config file")
    process.exit(1)
  } else {
    config.apiKey = process.env.apiKey
    config.project = process.env.project
    config.version = process.env.version
    config.user = process.env.user
  }
}

if (args.length < 3) {
  console.log('Did not specify the correct number of args')
  process.exit(1)
} else {
  action = args[2]
}

if (action ==='upload') {
  exportPotFile().then((output) => {
    console.log(output)
    uploadZanata().then((output) => {
      console.log(output)
    })
  })
}
else if (action === 'download') {
  console.log("Downloading Files")
  for (var language of languages) {
    downloadZanata(language).then((output) => {
      console.log(output)
    })
  }
}

function setLanguages(languageList){
  const tmpLanguages = []
  for (var key in languageList) {
    tmpLanguages.push(key)
  }

  return tmpLanguages
}

function compilePoFile(language) {
  const poFile = language.replace(/-/g, '_')
  const cmd = `node ./node_modules/angular-gettext-cli/bin/gettext --compile --files "client/gettext/po/${language}/${poFile}.po" --format json --dest "./client/gettext/json/${language}/manageiq-ui-service.json" `
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error)
      }
      resolve(stdout)
    });
  });
}

function exportPotFile() {
  const cmd = 'node ./node_modules/angular-gettext-cli/bin/gettext --files "./client/app/**/*.+(js|html)" --dest "./client/gettext/po/manageiq-ui-service.pot" --marker-name __'
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error)
      }
      resolve(stdout)
    });
  });
}

function uploadZanata() {
  const zanataOptions = [
    '-U https://translate.zanata.org/zanata/',
    `-u ${config.user}`,
    `-K ${config.apiKey}`,
    `project push`,
    `-p ${config.project}`,
    `-V ${config.version}`,
    `-t gettext`,
    '--pot-dir=client/gettext/po',
    '-v'
  ]
  const cmd = zanataOptions.join(' ')
  return new Promise((resolve, reject) => {
    exec('node ./node_modules/zanata-js/bin/zanata.js ' + cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error)
      }
      resolve(stdout)
    });
  });
}

function downloadZanata(language) {
  // console.log("downloading "+language)
 const zanataOptions = [
    '-U https://translate.zanata.org/zanata/',
    `-u ${config.user}`,
    `-K ${config.apiKey}`,
    `project pull`,
    `-p ${config.project}`,
    `-V ${config.version}`,
    `-t gettext`,
    `-l ${language}`,
    '--pot-dir=client/gettext/po',
    `--po-dir=client/gettext/po/${language}`,
    '-v -f -k'
  ]
  const cmd = zanataOptions.join(' ')

  return new Promise((resolve, reject) => {
    exec('node ./node_modules/zanata-js/bin/zanata.js ' + cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error)
      }
         compilePoFile(language).then((output) => {
         resolve(stdout+output)
      })
    });
  });
}
