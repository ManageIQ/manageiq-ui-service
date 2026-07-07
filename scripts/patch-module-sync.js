/**
 * Node 22 introduced the `module-sync` export condition, which some packages
 * (async-function, async-generator-function, generator-function) use to point
 * at `.mjs` files. When these are `require()`d by older tooling (eslint-plugin-import
 * via node-exports-info), Node 22 resolves the `.mjs` entry inside a CommonJS
 * context and crashes. This script removes the `module-sync` key from their
 * package.json exports so Node falls through to the `default` condition instead.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const packages = [
  'async-function',
  'async-generator-function',
  'generator-function',
];

function removeModuleSync(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(removeModuleSync);
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key !== 'module-sync') result[key] = removeModuleSync(val);
  }
  return result;
}

for (const pkg of packages) {
  const pkgPath = path.join('node_modules', pkg, 'package.json');
  try {
    const original = fs.readFileSync(pkgPath, 'utf8');
    if (!original.includes('module-sync')) continue;
    const json = JSON.parse(original);
    json.exports = removeModuleSync(json.exports);
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, '\t'));
    console.log(`patched: ${pkg}`);
  } catch (e) {
    // package not installed — skip silently
  }
}
