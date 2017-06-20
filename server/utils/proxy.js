/* eslint-disable no-undef, no-console, no-process-env, angular/log */

'use strict';

module.exports = function() {
  var service = {
    proxyHost: proxyHost,
    proxyErrorHandler: proxyErrorHandler,
  };

  return service;

  // Private

  function proxyHost() {
    return process.env.PROXY_HOST || '[::1]:3000';
  }

  function proxyErrorHandler(_req, res) {
    return function(err, _data) {
      if (!err) {
        return;
      }

      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });

      res.end('Something went wrong: ' + err);
      console.error(err);
    };
  }
};
