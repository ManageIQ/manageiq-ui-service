(function() {
  'use strict';

  angular.module('app.skin', [])
    .factory('Text', Text)
    .config(configure);

  /** @ngInject */
  function Text($timeout, $rootScope) {
    var o = {
      app: {
        name: null,
      },
      login: {
        brand: null,
      },
    };

    function init() {
      o.app.name = __('ManageIQ Self Service');
      o.login.brand = '<strong>ManageIQ</strong> ' + __('Self Service');
    }

    $rootScope.$on('gettextLanguageChanged', init);

    return o;
  }

  /** @ngInject */
  function configure(routerHelperProvider, exceptionHandlerProvider) {
    exceptionHandlerProvider.configure('[ManageIQ] ');
    routerHelperProvider.configure({docTitle: 'ManageIQ: '});
  }
})();
