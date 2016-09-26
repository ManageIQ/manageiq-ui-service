(function() {
  'use strict';

  angular.module('app.services')
    .factory('ServerInfo', ServerInfo);

  /** @ngInject */
  function ServerInfo($q) {
    var factory = {};
    factory.data = {};
    factory.promise = $q(function(resolve) {
      factory.set = function(data) {
        factory.data = {
          user: data.identity.name,
          role: data.identity.role,
          version: data.server_info.version + '.' + data.server_info.build,
          server: data.server_info.appliance,
        };
        resolve(factory.data);
        
        return data;
      };
    });
    
    return factory;
  }
})();
