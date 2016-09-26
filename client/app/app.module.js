(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.config',
    'app.states',
    'ngProgress',
    'gettext',
  ]).controller('AppController', ['$scope', 'ngProgressFactory', AppController]);

  /** @ngInject */
  function AppController($scope, ngProgressFactory) {
    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.progressbar.setColor('#0088ce');
    vm.progressbar.setHeight('3px');

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.resolve) {
        vm.progressbar.start();
      }
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (toState.resolve) {
        vm.progressbar.complete();
      }
    });

    vm.keyDown = function(evt) {
      $scope.$broadcast('bodyKeyDown', {origEvent: evt});
    };

    vm.keyUp = function(evt) {
      $scope.$broadcast('bodyKeyUp', {origEvent: evt});
    };
  }
})();
