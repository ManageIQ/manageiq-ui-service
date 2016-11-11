/*jshint node:true*/
'use strict';

var http = require('http');
var express = require('express');
var httpProxy = require('http-proxy');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();
var url = require('url');

var environment = process.env.NODE_ENV;
var PROXY_HOST = process.env.PROXY_HOST || '[::1]:3000';

var PROXY_TARGET = 'http://' + PROXY_HOST + '/api';
var WS_PROXY_TARGET = 'http://' + PROXY_HOST;

var proxy_error_handler = function(req, res) {
  return function(err, data) {
    if (!err)
      return;

    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    res.end('Something went wrong: ' + err);
    console.error(err);
  }
}

var proxy = httpProxy.createProxyServer({
  target: PROXY_TARGET,
});

var wsProxy = httpProxy.createProxyServer({
  target: WS_PROXY_TARGET,
  ws: true,
});

app.use('/api', function(req, res) {
  var path = url.parse(req.url).path;

  console.log('PROXY: ' + PROXY_TARGET + path);
  proxy.web(req, res, proxy_error_handler(req, res));
});

router.use(favicon(__dirname + '/favicon.ico'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(logger('dev'));

app.use('/self_service/', router);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./public/index.html'));
    break;
  default:
    console.log('** DEV **');
    router.use(express.static('./client/'));
    router.use(express.static('./images'));
    router.use(express.static('./.tmp')); // gulp dev build dir
    router.use(express.static('./client/assets'));
    var pictureProxy = httpProxy.createProxyServer({
      target: 'http://' + PROXY_HOST + '/pictures',
    });
    app.use('/pictures', function(req, res) {
      pictureProxy.web(req, res, proxy_error_handler(req, res));
    });
    app.use(express.static('./'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    router.use('/app/*', function(req, res) {
      four0four.send404(req, res);
    });
    // makes both /bower_components and /self_service/bower_components/ work
    router.use(express.static('./'));
    // Any deep link calls should return index.html
    app.use('/*', express.static('./client/index.html'));
    break;
}

var server = http.createServer(app);

server.on('upgrade', function (req, socket, head) {
  console.log('PROXY(ws,upgrade): ' + req.url);
  wsProxy.ws(req, socket, head);
});

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') + '\n__dirname = '
    + __dirname + '\nprocess.cwd = ' + process.cwd());
});
