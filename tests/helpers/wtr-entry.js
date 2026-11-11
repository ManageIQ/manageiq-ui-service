// Test entry for @web/test-runner. Loads the app and the (classic script) specs in order.
// Top-level await keeps mocha from starting until every spec has registered itself.
function loadScript (src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

// Equivalent of karma-read-json: synchronous JSON fetch relative to the project root
window.readJSON = function (url) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `/${url}`, false)
  xhr.send(null)
  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText)
  }
  console.error('readJSON', url, xhr.statusText)
  return null
}

const specs = await (await fetch('/__specs.json')).json()

// angular-mocks must load after mocha's globals exist; sinon exposes window.sinon
const scripts = [
  '/dist/app.js',
  '/dist/chai-bundle.js',
  '/node_modules/sinon/pkg/sinon.js',
  '/node_modules/angular/angular-mocks.js',
  '/node_modules/bardjs/bard.js',
  ...specs,
]

for (const src of scripts) {
  await loadScript(src)
}
