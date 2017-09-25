const shell = require('shelljs')

if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST === 'false') {
  const zanataUpload = shell.exec('yarn zanata:upload', { silent: true }).stdout
  console.log('Uploading language file to Zanata')
  console.log(zanataUpload)
}
