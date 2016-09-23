(function() {
  'use strict';

  angular.module('app.services')
    .service('ServerInfo', ServerInfo);

  /** @ngInject */
  function ServerInfo($q) {
    var vm = this;
    vm.data = {};
    vm.promise = $q(function(resolve, reject) {
      vm.set = function(data) {
        vm.data = {
          user: data.identity.name,
          role: data.identity.role,
          version: data.server_info.version + '.' + data.server_info.build,
          server: data.server_info.appliance,
        };
        resolve(vm.data);
        
        return data;
      };
    });
  }
})();
