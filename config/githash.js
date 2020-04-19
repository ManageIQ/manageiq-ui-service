const { exec } = require('shelljs');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const input = join(__dirname, '../BUILD');
const output = join(__dirname, '../client/version/version.json');

let gitCommit = existsSync(input)
  ? readFileSync(input, { encoding: 'utf-8' })
  : exec('git rev-parse HEAD', { silent: true }).stdout;
gitCommit = gitCommit.replace("\n", '');

writeFileSync(output, JSON.stringify({ gitCommit }));

console.log(`Successfully wrote Git hash - ${gitCommit}`);
