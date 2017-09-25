const shell = require('shelljs')
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../client/version/version.json')
const gitCommit = shell.exec('git rev-parse HEAD', {silent: true}).stdout

const gitFileContents = `{"gitCommit": "${gitCommit.replace("\n", '')}"}` // eslint-disable-line 
fs.writeFile(filePath, gitFileContents, (err) => {
  if (err) throw err
  console.log(`Successfully wrote Git hash - ${gitCommit}`)
})
