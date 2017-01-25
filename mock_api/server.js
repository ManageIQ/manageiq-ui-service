var jsonServer = require('json-server')
var server = jsonServer.create();
var bodyParser = require('body-parser');
var router = "";
var middlewares = jsonServer.defaults()
var fs = require('fs');
var url  = require('url');
var _ = require('lodash');

var glob = require("glob")
var restData = {};

server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'debug') {
    console.log(req.body);
  }
  next()
});

function init() {
  loadDataFiles().then(function (resp) { // We load all endpoints
    return loadLocalOverrideFiles(resp);
  })
    .then(function (endpoints) { // We apply local endpoint overrides
      var uniqueURLS = 0;
      _.forIn(endpoints, function (data, endpointName) {
        uniqueURLS += Object.keys(data).length;
        buildRESTRoute(data, endpointName); //  This builds the rest route
      });
      console.log("Endoints loaded "+ Object.keys(endpoints).length);
      console.log("Unique URLS loaded "+uniqueURLS);
      router = jsonServer.router();
      startServer();
    });
}
init();

function loadDataFiles() {
  var allEndpoints = {};
  return new Promise(
    function (resolve, reject) {
      glob("./data/**/*.json", function (er, files) {
        files.forEach(function (file) {
          allEndpoints = processFile(file, allEndpoints);
        });
        resolve(allEndpoints);
      });
    });
}

function loadLocalOverrideFiles(allEndpoints) {
  return new Promise(
    function (resolve, reject) {
      glob("./local/**/*.json", function (er, files) {
        files.forEach(function (file) {
          allEndpoints = processFile(file, allEndpoints);
        });
        resolve(allEndpoints);
      });
    });
}

function processFile(file,allEndpoints) {
  var dataFile = require(file);

  var urlParts = url.parse(dataFile.url);
  var endpoint = urlParts.pathname;

  if (!allEndpoints.hasOwnProperty(endpoint)) {
    allEndpoints[endpoint] = {};
  }
  //if it is a subpath deal with stripping out endpoint and create a
  if (endpoint.includes('/')) {
    var urlArray = endpoint.split('/');
    var actualEndpoint = urlArray.shift();
    var remainingUrl = urlArray.join('/');
    if (!allEndpoints.hasOwnProperty(actualEndpoint)) {
      allEndpoints[actualEndpoint] = {};
    }
    allEndpoints[actualEndpoint][remainingUrl] = dataFile;
  }
  if (urlParts.query != null) {
    allEndpoints[endpoint][urlParts.query] = dataFile;
  }
  else {
    allEndpoints[endpoint][endpoint] = dataFile;
  }
  return allEndpoints;
}
function buildRESTRoute(data, endpointName) {
  var urlPath = '';
  if (endpointName === 'api') {
    urlPath = '/api';
  }
  else {
    urlPath = '/api/' + endpointName + '*';
  }

  server.all(urlPath, function (req, res) {
    var url_parts = url.parse(req.url, false);
    var query = req.url;
    var endpoint = query.replace(/\/api\//,"");
    var match = '';
    if (endpoint === endpointName && data.hasOwnProperty(endpoint)) { //this happens when no querystring is passed
      match = data[endpoint];
    }
    else {
      var querystrings = Object.keys(data).map(key => data[key]);

      var match = _.find(querystrings, function (item) {
        return query.includes(item.url);
      });
    }
    if (match != undefined) {
      //TODO: DEAL WITH PARTIAL MATCHES
      var jsonResponse = generateResponse(req, match);
      res.json(jsonResponse);
    }
    else {
      res.sendStatus(501);
    }
  });

}

/*  KEEP THIS FOR reference
    var json = JSON.stringify(restData);
    fs.writeFile('./db.json', json);
    router = jsonServer.router(restData);
 */

//});

function generateResponse(request, data) {
  var reqMethod = request.method.toLowerCase();
  var requestMethodExists = (data.hasOwnProperty(reqMethod) ? true : false);
  if (requestMethodExists) {
    return data[reqMethod];
  }
  else {
    return { "status": "Data was received and the http method was " + reqMethod, "data": request.body };
  }
}

function startServer() {
  server.use(jsonServer.rewriter({
    '/api/:resource': '/:resource'
  }));
  server.use(middlewares);
   server.use(function(req, res){
      res.sendStatus(501);
   });
  server.use(router);

  var port = 3000;
  if (process.env.MOCK_API_HOST) {
    var urlParts = url.parse(process.env.MOCK_API_HOST, false);
    port = urlParts.host;
  }

  server.listen(port, function () {
    console.log('Mock API Server is running on port ' + port);
  })
}
