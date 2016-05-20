(function() {
  'use strict';

  angular.module('app.components')
    .factory('DialogEditorModal', EditDialogFactory);

  /** @ngInject */
  function EditDialogFactory($modal) {
    var modalDialog = {
      showModal: showModal
    };

    return modalDialog;

    function showModal(tab, box, field) {
      var modalOptions = {
        templateUrl: 'app/components/dialog-editor-modal/dialog-editor-modal.html',
        controller: DialogEditorModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          dialogDetails: resolveDialogDetails
        }
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveDialogDetails() {
        return {tabId: tab, boxId: box, fieldId: field};
      }
    }
  }

  /** @ngInject */
  function DialogEditorModalController(dialogDetails, $state, $modalInstance,
                                       CollectionsApi, Notifications,
                                       DialogEditor, lodash) {
    var vm = this;

    vm.dialog = dialogDetails;
    vm.saveDialogFieldDetails = saveDialogFieldDetails;
    vm.deleteField = deleteField;
    vm.modalUnchanged = modalUnchanged;
    vm.addEntry = addEntry;
    vm.removeEntry = removeEntry;

    // recognize edited element type
    if (vm.dialog.fieldId === undefined &&
        vm.dialog.boxId === undefined &&
        vm.dialog.tabId !== undefined) {
      vm.element = 'tab';
    } else if (vm.dialog.fieldId === undefined &&
             vm.dialog.boxId !== undefined &&
             vm.dialog.tabId !== undefined) {
      vm.element = 'box';
    } else if (vm.dialog.fieldId !== undefined &&
             vm.dialog.boxId !== undefined &&
             vm.dialog.tabId !== undefined) {
      vm.element = 'field';
    }

    // clone data from service
    switch (vm.element) {
      case 'tab':
        vm.modalData = lodash.cloneDeep(
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ]
        );
        break;
      case 'box':
        vm.modalData = lodash.cloneDeep(
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].dialog_groups[
            vm.dialog.boxId
          ]
        );
        break;
      case 'field':
        vm.modalData = lodash.cloneDeep(
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].dialog_groups[
            vm.dialog.boxId
          ].dialog_fields[
            vm.dialog.fieldId
          ]
        );
        break;
      default:
        break;
    }

    activate();

    function activate() {
    }

    /**
     * Check for changes in modal
     */
    function modalUnchanged() {
      switch (vm.element) {
        case 'tab':
          return lodash.isMatch(
            DialogEditor.getData().content[0].dialog_tabs[
              DialogEditor.activeTab
            ],
            vm.modalData
          );
        case 'box':
          return lodash.isMatch(
            DialogEditor.getData().content[0].dialog_tabs[
              DialogEditor.activeTab
            ].dialog_groups[
              vm.dialog.boxId
            ],
            vm.modalData
          );
        case 'field':
          return lodash.isMatch(
            DialogEditor.getData().content[0].dialog_tabs[
              DialogEditor.activeTab
            ].dialog_groups[
              vm.dialog.boxId
            ].dialog_fields[
              vm.dialog.fieldId
            ],
            vm.modalData
          );
        default:
          break;
      }
    }

    /**
     * Store modified data to service
     */
    function saveDialogFieldDetails() {
      // TODO: add verification for required forms
      // store data to service
      switch (vm.element) {
        case 'tab':
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].label = vm.modalData.label;
          // description
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].description = vm.modalData.description;
          break;
        case 'box':
          // label
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].dialog_groups[
            vm.dialog.boxId
          ].label = vm.modalData.label;
          // description
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].dialog_groups[
            vm.dialog.boxId
          ].description = vm.modalData.description;
          break;
        case 'field':
          DialogEditor.getData().content[0].dialog_tabs[
            DialogEditor.activeTab
          ].dialog_groups[
            vm.dialog.boxId
          ].dialog_fields[
            vm.dialog.fieldId
          ] = vm.modalData;
          break;
        default:
          break;
      }

      // close modal
      $modalInstance.close();
    }

    /**
     * Delete dialog field selected in modal
     */
    function deleteField() {
      lodash.remove(
        DialogEditor.getData().content[0].dialog_tabs[
          DialogEditor.activeTab
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
