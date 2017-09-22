const fs = require('fs')
const path = require('path')
const potFile = path.join(__dirname, '../client/gettext/po/manageiq-ui-service.pot')
const contents = fs.readFileSync(potFile, 'utf8')
const re = /<(.|\n)*>|{{(.|\n)*}}/gim // checks for html and also for javascript
const matches = contents.match(re)

if (matches.length > 0) {
  console.log('Errors exist in language file')
  console.log(matches)
  process.exit(1)
} else {
  process.exit(0)
}
