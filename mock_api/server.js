const jsonServer = require('json-server');
const fs = require('fs');
const url = require('url');
const lodash = require('lodash');
const glob = require('glob');
const path = require('path');

let server = jsonServer.create();
let router = jsonServer.router();
let middlewares = jsonServer.defaults();

init();

function init() {
  server.use(jsonServer.bodyParser);
  server.use(function(req, res, next) {
    if (process.env.LOG_LEVEL && process.env.LOG_LEVEL === 'debug') {
      console.log(req.body);
    }
    next();
  });

  loadDataFiles().then(function(resp) { // We load all endpoints
    return loadLocalOverrideFiles(resp);
  })
    .then(function(endpoints) { // We apply local endpoint overrides
      let uniqueURLS = 0;
      lodash.forIn(endpoints, function(data, endpointName) {
        uniqueURLS += Object.keys(data).length;
        buildRESTRoute(data, endpointName); //  This builds the rest route
      });
      console.log("Endoints loaded " + Object.keys(endpoints).length);
      console.log("Unique URLS loaded " + uniqueURLS);
      startServer();
    });
}

function startServer() {
  server.use(jsonServer.rewriter({
    '/api/:resource': '/:resource',
  }));

  server.use(middlewares);
  server.use(function(req, res) {
    res.sendStatus(501);
  });
  server.use(router);

  let port = 3000;
  if (process.env.MOCK_API_HOST) {
    let urlParts = url.parse(process.env.MOCK_API_HOST, false);
    port = urlParts.host;
  }

  server.listen(port, function() {
    console.log('Mock API Server is running on port ' + port);
  })
}

function loadDataFiles() {
  let allEndpoints = {};
  return new Promise(
    function(resolve, reject) {
      glob("./data/**/*.json", function(er, files) {
        files.forEach(function(file) {
          allEndpoints = processFile(file, allEndpoints);
        });
        resolve(allEndpoints);
      });
    });
}

function loadLocalOverrideFiles(allEndpoints) {
  return new Promise(
    function(resolve, reject) {
      glob("./local/**/*.json", function(er, files) {
        files.forEach(function(file) {
          allEndpoints = processFile(file, allEndpoints);
        });
        resolve(allEndpoints);
      });
    });
}

function processFile(file, allEndpoints) {
  const dataFile = require(file);
  let urlParts = url.parse(dataFile.url);
  let endpoint = urlParts.pathname;


  //if it is a subpath deal with stripping out endpoint and create a
  if (endpoint.includes('/')) {
    let urlArray = endpoint.split('/');
    let actualEndpoint = urlArray.shift();
    let remainingUrl = urlArray.join('/');
    if (!allEndpoints.hasOwnProperty(actualEndpoint)) {
      allEndpoints[actualEndpoint] = {};
    }
    if (urlParts.search != null){
      remainingUrl += urlParts.search;
    }
    allEndpoints[actualEndpoint][remainingUrl] = dataFile;
  }
  else {
    if (!allEndpoints.hasOwnProperty(endpoint)) {
      allEndpoints[endpoint] = {};
    }

    if (urlParts.query != null) {

      allEndpoints[endpoint][urlParts.query] = dataFile;
    }
    else {
      allEndpoints[endpoint][endpoint] = dataFile;
    }
  }

  return allEndpoints;
}

function buildRESTRoute(data, endpointName) {
  let urlPath = '';
  if (endpointName === 'api') {
    urlPath = '/api';
  }
  else {
    urlPath = '/api/' + endpointName + '*';
  }

  server.all(urlPath, function(req, res) {
    const query = req.url;
    let endpoint = query.replace(/\/api\//, "");
    let match = '';
    if (endpoint === endpointName && data.hasOwnProperty(endpoint)) { //this happens when no querystring is passed
      match = data[endpoint];
    }
    else {
      const querystrings = Object.keys(data).map(key => data[key]);
      
      match = lodash.find(querystrings, function(item) {
        return query.includes(item.url);
      });
    }
    if (match !== undefined) {
      //TODO: DEAL WITH PARTIAL MATCHES
      const jsonResponse = generateResponse(req, match);
      res.json(jsonResponse);
    }
    else {
      res.sendStatus(501);
    }
  });

}

function generateResponse(request, data) {
  let reqMethod = request.method.toLowerCase();
  let requestMethodExists = data.hasOwnProperty(reqMethod);
  if (requestMethodExists) {
    return data[reqMethod];
  }
  else {
    return {"status": "Data was received and the http method was " + reqMethod, "data": request.body};
  }
}
