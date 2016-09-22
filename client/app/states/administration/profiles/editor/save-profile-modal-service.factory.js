(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveProfileModal', SaveProfileFactory);

  /** @ngInject */
  function SaveProfileFactory($modal) {
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
      var modal = $modal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveProfileModalController(saveCallback, doNotSaveCallback, cancelCallback, $modalInstance) {
    var vm = this;
    vm.save = save;
    vm.doNotSave = doNotSave;
    vm.cancel = cancel;

    function save() {
      saveCallback();
      $modalInstance.close();
    }

    function doNotSave() {
      doNotSaveCallback();
      $modalInstance.close();
    }

    function cancel() {
      cancelCallback();
      $modalInstance.close();
    }
  }
})();
