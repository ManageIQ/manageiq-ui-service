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
glob("./data/*.mock.json", function (er, files) {
  // files is an array of filenames.
console.log("Found "+ files.length + " endpoint files");
  files.forEach(function (file) {
    var dataFile = require(file);

    restData[dataFile.endpoint] = dataFile.data;
    var urlPath = '';
    if (dataFile.endpoint == 'api') {
      urlPath = '/api';
    }
    else {
      urlPath = '/api/' + dataFile.endpoint;
    }
    server.all(urlPath, function (req, res) {
     var jsonResponse = generateResponse(req,dataFile);
     res.json(jsonResponse);
    });
    
    if (dataFile.querystrings) {
      server.all(urlPath, function (req, res) {
        var url_parts = url.parse(req.url, false);
        var query = req.url;
        var match = _.find(dataFile.querystrings, function (item) {
          return query.includes(item.endpoint);
        });

        if (match != undefined) {
          var jsonResponse = generateResponse(req, match);
          res.json(jsonResponse);
        }
        else {
          res.json(dataFile.data);
        }
      });
    }
  });

    var json = JSON.stringify(restData);
    fs.writeFile('./db.json', json);
    router = jsonServer.router(restData);
    
  startServer();
});

function generateResponse(request, data){
  var reqMethod = request.method.toLowerCase();
      var requestMethodExists = (data.hasOwnProperty(reqMethod) ? true: false);
      if (reqMethod === 'get') {
        if (requestMethodExists) {
          return data.get;
        }
        else {
          return data.data;
        }
      }
      else {
        if (requestMethodExists) {
         return data[reqMethod];
        }
        else{
          return {"status":"Data was received and the http method was "+reqMethod,"data": req.body} ;
        }
      }
}

function startServer() {
  server.use(jsonServer.rewriter({
    '/api/:resource': '/:resource'
  }));
  server.use(middlewares);
  server.use(router);

  var port = 3004;
  if (process.env.MOCK_API_HOST) {
    var urlParts = url.parse(process.env.MOCK_API_HOST, false);
    port = urlParts.host;
  }

  server.listen(port, function () {
    console.log('Mock API Server is running on port ' + port);
  })
}
