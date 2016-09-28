'use strict';

module.exports = function() {
  var service = {
    proxyHost: proxyHost ,
    proxyErrorHandler: proxyErrorHandler
  };

  return service;

// Private

  function proxyHost(){
    return process.env.PROXY_HOST || '[::1]:3000';
  }

  function proxyErrorHandler(req, res) {
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

};
