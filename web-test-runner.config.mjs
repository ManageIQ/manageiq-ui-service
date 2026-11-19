import { chromeLauncher } from '@web/test-runner-chrome'
import { globSync } from 'glob'

// Spec files are classic scripts that rely on globals (angular, inject, module, sinon, ...),
// so tests/helpers/wtr-entry.js loads them in order and mocha runs once they are registered.
const specs = ['client/app/**/*.spec.js', 'tests/**/*.spec.js']
  .flatMap((pattern) => globSync(pattern))
  .sort()
  .map((file) => `/${file}`)

export default {
  rootDir: '.',
  files: ['tests/helpers/wtr-entry.js'],
  nodeResolve: false,
  // Some specs log objects that cannot be serialized; forwarding those logs stalls the run
  browserLogs: false,
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000,
    },
  },
  coverageConfig: {
    reportDir: 'reports/coverage',
    reporters: ['text-summary', 'lcovonly'],
    // Coverage is mapped back to client/app through the webpack source maps
    include: ['dist/app.js'],
  },
  browsers: [
    chromeLauncher({
      launchOptions: {
        // --no-sandbox because in ACT we don't have sudo access
        args: ['--no-sandbox'],
      },
    }),
  ],
  plugins: [
    {
      name: 'spec-list',
      serve(context) {
        if (context.path === '/__specs.json') {
          return { body: JSON.stringify(specs), type: 'json' }
        }
      },
    },
  ],
}
