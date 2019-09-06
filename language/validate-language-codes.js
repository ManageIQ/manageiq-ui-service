const fs = require('fs')
const path = require('path')

const parsed = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/gettext/json/manageiq-ui-service.json'), 'utf8'))
let errors = 0

Object.keys(parsed).forEach((lang) => {
  if (lang.includes('_')) { // language code should not contain underscore
    console.log('Invalid language code: ', lang)
    errors++
  }
})

process.exit(errors)
