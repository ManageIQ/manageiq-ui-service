/* eslint-disable no-undef, no-console, no-return-assign */
const axios = require('axios')
const fs = require('fs')
const Gettext = require('./gettext.js').Gettext
const _ = require('lodash')
let config = {}

const zanata = {
  setConfig (configSettings) {
    config = configSettings
    axios.defaults.baseURL = `https://translate.zanata.org/zanata/`
    axios.defaults.headers.common['X-Auth-User'] = config.user
    axios.defaults.headers.common['X-Auth-Token'] = config.apiKey
  },
  upload (potFile) {
    const contents = fs.readFileSync(potFile, 'UTF-8')
    Gettext.po2json('manageiq-ui-service.pot', 'pot', contents)
      .then((data) => {
        var requestConfig = {
          headers: {'Content-Type': 'application/json'}
        }
        axios.put(`rest/projects/p/${config.project}/iterations/i/${config.version}/r/manageiq-ui-service`,
          JSON.stringify(data), requestConfig).then((response) => {
          // console.log(response);
            if (response.status === 200) {
              console.log('POT file uploaded successfully')
            }
          })
      })
  },
  download (locales, outputDir) {
    zanata.getSourceFile().then((outputFile) => {
      locales.forEach((locale) => {
        console.log('downloading locale ' + locale)
        zanata.getFile(locale).then((data) => {
          const sourceFile = _.clone(outputFile)
          Object.keys(data).forEach((k) => sourceFile[k] = data[k])
          Gettext.json2po(sourceFile).then((poData) => {
            const poFilename = locale.replace(/-/g, '_')
            fs.writeFile(`${outputDir}/${locale}/${poFilename}.po`, poData.toString(), function (err) {
              if (err) {
                return console.log(err)
              }
            })
          })
        })
      })
    })
  },
  getFile (locale) {
    const reqConfig = {
      headers: {'Accept': 'application/json'}
    }
    const url = `rest/projects/p/${config.project}/iterations/i/${config.version}/r/manageiq-ui-service/translations/${locale}?ext=gettext&ext=comment&skeletons=true`
    return axios.get(url, reqConfig).then((data) => data.data)
  },
  getSourceFile () {
    const reqConfig = {
      headers: {'Accept': 'application/json'}
    }
    const url = `rest/projects/p/${config.project}/iterations/i/${config.version}/r/manageiq-ui-service?ext=gettext&ext=comment`
    return axios.get(url, reqConfig).then((data) => data.data)
  }
}
module.exports = zanata
