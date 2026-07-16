const { FlatCompat } = require('@eslint/eslintrc');
const babelParser = require('@babel/eslint-parser');
const js = require('@eslint/js');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['node_modules/', 'reports/', 'dist/'],
  },

  ...compat.extends('eslint:recommended', 'eslint-config-angular'),

  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        requireConfigFile: false,
      },
      globals: {
        ...globals.amd,
        ...globals.browser,
        ...globals.es2015,
        ...globals.jasmine,
        ...globals.jquery,
        ...globals.node,
        ...globals.protractor,
        Atomics: 'readonly',
        N_: 'readonly',
        SharedArrayBuffer: 'readonly',
        __: 'readonly',
        angular: 'readonly',
        bard: 'readonly',
        sinon: 'readonly',
      },
    },
    plugins: {
      angular: require('eslint-plugin-angular'),
      import: require('eslint-plugin-import'),
    },
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
    },
  },
];
