(function iife() {
  'use strict';

  angular.module('blocks.modalState', ['ui.bootstrap', 'ui.router'])
    .provider('modalStateHelper', ['$stateProvider', modalStateHelperProvider])
    .config(['$uibResolveProvider', configure]);

  function modalStateHelperProvider($stateProvider) {
    var provider = {
      $get: [ModalStateHelper],
    };

    return provider;

    function ModalStateHelper() {
      var service = {
        configureModals: configureModals,
      };

      return service;
    }

    function configureModals(modals) {
      angular.forEach(modals, buildModal);
    }

    function buildModal(options, stateName) {
      var modalInstance;

      var stateConfig = {
        url: options.url,
        onEnter: ['$uibModal', '$state', onEnter],
        onExit: onExit,
      };

      $stateProvider.state(stateName, stateConfig);

      function onEnter($uibModal, $state) {
        modalInstance = $uibModal.open(options);

        modalInstance.result.finally(redirect);

        function redirect() {
          modalInstance = null;
          if ($state.$current.name === stateName) {
            $state.go(options.redirectTo || '^');
          }
        }
      }

      function onExit() {
        if (modalInstance) {
          modalInstance.close();
        }
      }
    }
  }

  function configure($uibResolveProvider) {
    $uibResolveProvider.setResolver('$resolve');
  }
})();
