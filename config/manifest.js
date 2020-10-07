const fs = require('fs');
const sortBy = require('lodash/sortBy');

const uniqueWebpackModules = (data) => {
  // recursively flatten nested modules
  const transformModule  = m  => m.modules ? transformModules(m.modules) : m.name.split("!").pop();
  const transformModules = ms => ms.flatMap(m => transformModule(m));

  var modules = transformModules(data.modules).sort();
  modules = [...new Set(modules)]; // uniq

  return modules;
};

const packagesFromModules = (modules) => {
  // find the package.json file for each module
  modules = modules.filter(m => m.includes("node_modules"));
  var packagePaths = modules.map(m => {
    var match = m.match(/(.*node_modules\/)([^/]+)(\/[^/]+)?/);
    var path = [
      `${match[1]}${match[2]}/package.json`,
      `${match[1]}${match[2]}${match[3]}/package.json`,
    ].find(p => fs.existsSync(p));

    if (path == null) {
      console.warn(`[webpack-manifest] WARN: Unable to find a package.json for ${m}`);
    }

    return path;
  })
  packagePaths = packagePaths.filter(p => p != null);
  packagePaths = [...new Set(packagePaths)]; // uniq

  // extract relevant package data from the package.json
  var packages = packagePaths.map(p => {
    var content = fs.readFileSync(p);
    var pkg = JSON.parse(content);
    return {
      name: pkg.name,
      license: pkg.license,
      version: pkg.version,
      location: p
    }
  });
  packages = sortBy(packages, ['name', 'version']);

  return packages;
};

module.exports = {
  packagesFromModules,
  uniqueWebpackModules,
};
