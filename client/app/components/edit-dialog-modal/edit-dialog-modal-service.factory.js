(function() {
  'use strict';

  angular.module('app.components')
    .factory('EditDialogModal', EditDialogFactory);

  /** @ngInject */
  function EditDialogFactory($modal) {
    var modalDialog = {
      showModal: showModal
    };

    return modalDialog;

    function showModal(box, field) {
      var modalOptions = {
        templateUrl: 'app/components/edit-dialog-modal/edit-dialog-modal.html',
        controller: EditDialogModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          dialogDetails: resolveDialogDetails
        }
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveDialogDetails() {
        return {boxId: box, fieldId: field};
      }
    }
  }

  /** @ngInject */
  function EditDialogModalController(dialogDetails, $state, $modalInstance,
                                     CollectionsApi, Notifications,
                                     DialogEdit, lodash) {
    var vm = this;

    vm.dialog = dialogDetails;
    vm.saveDialogFieldDetails = saveDialogFieldDetails;
    vm.deleteField = deleteField;
    vm.modalUnchanged = modalUnchanged;
    vm.addEntry = addEntry;
    vm.removeEntry = removeEntry;

    // clone data from service
    vm.modalData = lodash.cloneDeep(
      DialogEdit.getData().content[0].dialog_tabs[
        DialogEdit.activeTab
      ].dialog_groups[
        vm.dialog.boxId
      ].dialog_fields[
        vm.dialog.fieldId
      ]
    );

    activate();

    function activate() {
    }

    /**
     * Check for changes in modal
     */
    function modalUnchanged() {
      return lodash.isMatch(
        DialogEdit.getData().content[0].dialog_tabs[
          DialogEdit.activeTab
        ].dialog_groups[
          vm.dialog.boxId
        ].dialog_fields[
          vm.dialog.fieldId
        ],
        vm.modalData
      );
    }

    /**
     * Store modified data to service
     */
    function saveDialogFieldDetails() {
      // TODO: add verification for required forms
      // store data to service
      DialogEdit.getData().content[0].dialog_tabs[
        DialogEdit.activeTab
      ].dialog_groups[
        vm.dialog.boxId
      ].dialog_fields[
        vm.dialog.fieldId
      ] = vm.modalData;

      // close modal
      $modalInstance.close();
    }

    /**
     * Delete dialog field selected in modal
     */
    function deleteField() {
      lodash.remove(
        DialogEdit.getData().content[0].dialog_tabs[
          DialogEdit.activeTab
        ].dialog_groups[
          vm.dialog.boxId
        ].dialog_fields,
        function(field) {
          return field.position === vm.dialog.fieldId;
        }
      );

      // close modal
      $modalInstance.close();
    }

    /**
     * Add entry for radio button / dropdown select
     */
    function addEntry() {
      vm.modalData.values.push(["", ""]);
    }

    /**
     * Remove entry for radio button / dropdown select
     *
     * Parameter: entry -- entry to remove from array
     */
    function removeEntry(entry) {
      lodash.pullAt(vm.modalData.values, entry);
    }
  }
})();
