(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveRuleModal', SaveRuleFactory);

  /** @ngInject */
  function SaveRuleFactory($modal) {
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
      var modal = $modal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveRuleModalController(saveCallback, doNotSaveCallback, cancelCallback, okToSave, $modalInstance) {
    var vm = this;
    vm.save = save;
    vm.doNotSave = doNotSave;
    vm.cancel = cancel;
    vm.okToSave = okToSave;

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
