var webServerDefaultPort = 3001;

var env = {
  // The address of a running selenium server.
  seleniumAddress:
    (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName':
        (process.env.TEST_BROWSER_NAME || 'chrome'),
    'version':
        (process.env.TEST_BROWSER_VERSION || 'ANY')
  },

  // Default http port to host the web server
  webServerDefaultPort: webServerDefaultPort,

  // Protractor interactive tests
  interactiveTestPort: 6969,

  // A base URL for your application under test.
  baseUrl:
    'http://' + (process.env.HTTP_HOST || 'localhost') +
          ':' + (process.env.HTTP_PORT || webServerDefaultPort)

};
// This is the configuration file showing how a suite of tests might
// handle log-in using the onPrepare field.
var config = {
 // seleniumAddress: env.seleniumAddress,
  specs: [
    '**/*.e2e.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/',

  onPrepare: function() {
    global.protractorConfig = env;
    browser.driver.get(env.baseUrl );
    browser.sleep(5000);
    browser.driver.findElement(by.id('inputUsername')).sendKeys('admin');
    browser.driver.findElement(by.id('inputPassword')).sendKeys('smartvm');
    browser.driver.findElement(by.css('button[type=submit]')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {

        return env.baseUrl +'/';
      });
    }, 10000);
  }
};

if (process.env.TRAVIS) {
  if (typeof process.env.SAUCE_USERNAME === 'undefined') {
    console.log("E2E Testing was not run because Sauce credentials are not set.  Please set in order to test");
    process.exit();
  }
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER
  };
}
else {
  config.seleniumAddress = env.seleniumAddress;
}

module.exports.config = exports.config = config;
