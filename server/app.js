'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var httpProxy = require('http-proxy');
var four0four = require('./utils/404')();
var proxy = require('./utils/proxy')();
var serviceApp = require('./utils/serviceApp');
var serviceApi = require('./utils/serviceApi');

var app = express();

var port = process.env.PORT || 8001;
var environment = process.env.NODE_ENV;

// view engine setup
app.set('views', './client');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

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
  default:
    var proxyHost = proxy.proxyHost();
    var proxyErrorHandler = proxy.proxyErrorHandler;

    console.log('** DEV **');
    app.use(express.static('./'));

    // dev routes
    app.use('/self_service/', serviceApp);

    app.get('/self_service', function (req, res) {
      res.render('index');
    });

    app.use('/pictures', function(req, res) {
      pictureProxy.web(req, res, proxyErrorHandler(req, res));
    });

    var pictureProxy = httpProxy.createProxyServer({
      target: 'http://' + proxyHost + '/pictures',
    });

    app.use('/*', function (req, res) {
      res.render('index');
    });
    break;
}

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') + '\n__dirname = '
    + __dirname + '\nprocess.cwd = ' + process.cwd());
});
