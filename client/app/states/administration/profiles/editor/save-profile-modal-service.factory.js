(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveProfileModal', SaveProfileFactory);

  /** @ngInject */
  function SaveProfileFactory($uibModal) {
    var modalSaveProfile = {
      showModal: showModal,
    };

    return modalSaveProfile;

    function showModal(saveCallback, doNotSaveCallback, cancelCallback) {
      var modalOptions = {
        templateUrl: 'app/states/administration/profiles/editor/save-profile-modal.html',
        controller: SaveProfileModalController,
        controllerAs: 'vm',
        resolve: {
          saveCallback: resolveSave,
          doNotSaveCallback: resolveDoNotSave,
          cancelCallback: resolveCancel,
        },
      };

      function resolveSave() {
        return saveCallback;
      }

      function resolveDoNotSave() {
        return doNotSaveCallback;
      }

      function resolveCancel() {
        return cancelCallback;
      }
      var modal = $uibModal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveProfileModalController(saveCallback, doNotSaveCallback, cancelCallback, $uibModalInstance) {
    var vm = this;
    vm.save = save;
    vm.doNotSave = doNotSave;
    vm.cancel = cancel;

    function save() {
      saveCallback();
      $uibModalInstance.close();
    }

    function doNotSave() {
      doNotSaveCallback();
      $uibModalInstance.close();
    }

    function cancel() {
      cancelCallback();
      $uibModalInstance.close();
    }
  }
})();
