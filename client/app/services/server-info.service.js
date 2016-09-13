(function() {
  'use strict';

  angular.module('app.services')
    .service('ServerInfo', ServerInfo);

    /** @ngInject */
    function ServerInfo($q) {
      this.data = {};
      var self = this;
      this.promise = $q(function(resolve, reject) {
        self.set = function(data){
          self.data = {
            user: data.identity.name,
            role: data.identity.role,
            version: data.server_info.version + '.' + data.server_info.build,
            server: data.server_info.appliance,
          };
          resolve(self.data);
          return data;
        };
      });
    }
})();
