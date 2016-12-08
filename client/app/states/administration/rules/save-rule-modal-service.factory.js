(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveRuleModal', SaveRuleFactory);

  /** @ngInject */
  function SaveRuleFactory($uibModal) {
    var modalSaveRule = {
      showModal: showModal,
    };

    return modalSaveRule;

    function showModal(saveCallback, doNotSaveCallback, cancelCallback, okToSave) {
      var modalOptions = {
        templateUrl: 'app/states/administration/rules/save-rule-modal.html',
        controller: SaveRuleModalController,
        controllerAs: 'vm',
        resolve: {
          saveCallback: resolveSave,
          doNotSaveCallback: resolveDoNotSave,
          cancelCallback: resolveCancel,
          okToSave: resolveOkToSave,
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
      function resolveOkToSave() {
        return okToSave;
      }
      var modal = $uibModal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveRuleModalController(saveCallback, doNotSaveCallback, cancelCallback, okToSave, $uibModalInstance) {
    var vm = this;
    vm.save = save;
    vm.doNotSave = doNotSave;
    vm.cancel = cancel;
    vm.okToSave = okToSave;

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
