module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    jasmine: true,
    jquery: true,
    node: true,
    protractor: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-angular',
  ],
  globals: {
    Atomics: 'readonly',
    N_: 'readonly',
    SharedArrayBuffer: 'readonly',
    __: 'readonly',
    angular: 'readonly',
    bard: 'readonly',
    sinon: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'eslint-plugin-angular',
    'eslint-plugin-import',
  ],
  rules: {
    // prevent eslint-plugin-angular warnings about behaviour change
    'angular/service-name': ['error', {
      oldBehavior: false,
    }],

    // disable a bunch of "use the angular version of this" warnings
    'angular/angularelement': 'off',
    'angular/definedundefined': 'off',
    'angular/document-service': 'off',
    'angular/json-functions': 'off',
    'angular/log': 'off',
    'angular/on-watch': 'off',
    'angular/typecheck-array': 'off',
    'angular/typecheck-object': 'off',
    'angular/window-service': 'off',

    // FIXME: 71 problems
    'no-unused-vars': 'off',
  }
};
