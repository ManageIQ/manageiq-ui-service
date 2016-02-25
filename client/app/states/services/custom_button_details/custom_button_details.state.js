(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'services.custom_button_details': {
        url: '/:serviceId/custom_button_details/:buttonId',
        templateUrl: 'app/states/services/custom_button_details/custom_button_details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Service Custom Button Details'),
        params: {dialog: null, button: null, serviceTemplateCatalogId: null},
      }
    };
  }

  /** @ngInject */
  function StateController($state, $stateParams, CollectionsApi, Notifications, DialogFieldRefresh) {
    var vm = this;
    vm.title = __('Custom button action');
    vm.dialogs = [$stateParams.dialog];
    vm.submitCustomButton = submitCustomButton;

    var autoRefreshableDialogFields = [];
    var allDialogFields = [];

    angular.forEach(vm.dialogs, function(dialog) {
      angular.forEach(dialog.dialog_tabs, function(dialogTab) {
        angular.forEach(dialogTab.dialog_groups, function(dialogGroup) {
          angular.forEach(dialogGroup.dialog_fields, function(dialogField) {
            allDialogFields.push(dialogField);
            if (dialogField.default_value === '' && dialogField.values !== '') {
              dialogField.default_value = dialogField.values;
            }

            if (typeof (dialogField.values) === 'object' && dialogField.default_value === undefined) {
              dialogField.default_value = String(dialogField.values[0][0]);
            }

            dialogField.triggerAutoRefresh = function() {
              DialogFieldRefresh.triggerAutoRefresh(dialogField);
            };

            if (dialogField.auto_refresh === true) {
              autoRefreshableDialogFields.push(dialogField.name);
            }
          });
        });
      });
    });

    var dialogUrl = 'service_catalogs/' + $stateParams.serviceTemplateCatalogId + '/service_templates';

    angular.forEach(allDialogFields, function(dialogField) {
      dialogField.refreshSingleDialogField = function() {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, $stateParams.button.applies_to_id);
      };
    });

    DialogFieldRefresh.listenForAutoRefreshMessages(
      allDialogFields,
      autoRefreshableDialogFields,
      dialogUrl,
      $stateParams.button.applies_to_id
    );

    function submitCustomButton() {
      var dialogFieldData = {};

      angular.forEach(allDialogFields, function(dialogField) {
        dialogFieldData[dialogField.name] = dialogField.default_value;
      });

      CollectionsApi.post(
        'services',
        $stateParams.serviceId,
        {},
        JSON.stringify({action: $stateParams.button.name, resource: dialogFieldData})
      ).then(submitSuccess, submitFailure);

      function submitSuccess(result) {
        Notifications.success(result.message);
        $state.go('services.details', {serviceId: $stateParams.serviceId});
      }

      function submitFailure(result) {
        Notifications.error(__('There was an error submitting this request: ') + result);
      }
    }
  }
})();
