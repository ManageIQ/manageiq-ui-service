// Replacement for the unmaintained angular-gettext-cli, which requires glob@7.
// Usage:
//   node language/gettext.js --files <glob> [--exclude <glob>] --dest <file> [--marker-names a,b] [--no-line-numbers]
//   node language/gettext.js --compile --files <glob> --dest <file> --format json
const fs = require('fs')
const { parseArgs } = require('util')
const { globSync } = require('glob')
const { Extractor, Compiler } = require('angular-gettext-tools')

const { values } = parseArgs({
  options: {
    compile: { type: 'boolean', default: false },
    files: { type: 'string' },
    exclude: { type: 'string' },
    dest: { type: 'string' },
    format: { type: 'string' },
    encoding: { type: 'string' },
    'marker-names': { type: 'string' },
    'no-line-numbers': { type: 'boolean', default: false },
  },
})

if (!values.dest) {
  throw new Error('dest parameter missed')
}
if (!values.files) {
  throw new Error('files parameter missed')
}

// glob >= 9 strips a leading "./" from results; keep it so output matches the old tool
const prefix = values.files.startsWith('./') ? './' : ''
const fileNames = globSync(values.files, values.exclude ? { ignore: values.exclude } : {})
  .map((fileName) => prefix + fileName)
  .sort()
const encoding = values.encoding || 'utf-8'

let output
if (values.compile) {
  if (values.format && !Compiler.hasFormat(values.format)) {
    throw new Error('There is no "' + values.format + '" output format.')
  }
  const compiler = new Compiler({ format: values.format })
  output = compiler.convertPo(fileNames.map((fileName) => fs.readFileSync(fileName, encoding)))
  console.log('Finished compiling ' + values.files + ', read ' + fileNames.length + ' files.')
} else {
  const extractorOptions = {}
  if (values['marker-names']) {
    extractorOptions.markerNames = values['marker-names'].replace(/\s/g, '').split(',')
  }
  if (values['no-line-numbers']) {
    extractorOptions.lineNumbers = false
  }
  const extractor = new Extractor(extractorOptions)
  fileNames.forEach((fileName) => extractor.parse(fileName, fs.readFileSync(fileName, 'utf8')))
  output = extractor.toString()
  console.log('Finished parsing ' + values.files + ', read ' + fileNames.length + ' files.')
}

fs.writeFileSync(values.dest, output)
console.log('All files processed, stored in a file ' + values.dest)
