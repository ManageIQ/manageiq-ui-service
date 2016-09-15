(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.config',
    'app.states',
    'ngProgress',
    'gettext',
  ]).controller('AppController', ['$rootScope', 'ngProgressFactory', AppController]);

  /** @ngInject */
  function AppController($rootScope, ngProgressFactory) {
    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.progressbar.setColor('#0088ce');
    vm.progressbar.setHeight('3px');

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.resolve) {
        vm.progressbar.start();
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (toState.resolve) {
        vm.progressbar.complete();
      }
    });

    vm.keyDown = function(evt) {
      vm.$broadcast('bodyKeyDown', {origEvent: evt});
    };

    vm.keyUp = function(evt) {
      vm.$broadcast('bodyKeyUp', {origEvent: evt});
    };
  }
})();
