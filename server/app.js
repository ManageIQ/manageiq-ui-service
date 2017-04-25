/* eslint-disable no-undef, no-console, angular/log, no-path-concat */

const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const httpProxy = require('http-proxy');
const four0four = require('./utils/404')();
const proxyService = require('./utils/proxy')();
const serviceApi = require('./utils/serviceApi');

const buildOutputPath = process.env.BUILD_OUTPUT || './';
const app = express();
const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV;

// Secure http headers
app.use(helmet());

// Api
app.use('/api', serviceApi);

// Endowing these assets with higher precedence than api will cause issues
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./public/index.html'));
    break;
  default: {
    const proxyHost = proxyService.proxyHost();
    const proxyErrorHandler = proxyService.proxyErrorHandler;

    console.log('** DEV **');
    app.use(express.static(path.resolve(__dirname, buildOutputPath)));

    // dev routes
    app.use('/pictures', function(req, res) {
      pictureProxy.web(req, res, proxyErrorHandler(req, res));
    });

    const pictureProxy = httpProxy.createProxyServer({
      target: 'http://' + proxyHost + '/pictures',
    });

    app.all('*', function (_req, res, _next) {
      // Just send the index.html for other files to support HTML5Mode
      res.sendFile(path.resolve(__dirname, buildOutputPath + '/index.html'));
    });
    break;
  }
}

const server = http.createServer(app);

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') + '\n__dirname = '
    + __dirname + '\nprocess.cwd = ' + process.cwd());
});
