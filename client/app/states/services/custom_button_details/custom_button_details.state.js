import templateUrl from './custom_button_details.html';


/** @ngInject */
export function CustomButtonDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.custom_button_details': {
      url: '/:serviceId/custom_button_details/:buttonId',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Service Custom Button Details'),
      params: {dialogId: null, button: null, serviceTemplateCatalogId: null},
    },
  };
}

/** @ngInject */
function StateController($state, $stateParams, CollectionsApi, EventNotifications, DialogFieldRefresh, AutoRefresh) {
  var vm = this;
  vm.title = __('Custom button action');
  vm.dialogId = '';
  vm.dialogs = {};
  vm.service = {};
  vm.serviceId = $stateParams.serviceId;
  vm.button = $stateParams.button;
  vm.submitCustomButton = submitCustomButton;
  vm.loading = true;
  vm.init = init;
  var autoRefreshableDialogFields = [];
  var allDialogFields = [];

  function init() {
    const options = {expand: 'resources', attributes: 'content'};
    const dialogId = vm.button.resource_action.dialog_id;
    const resolveDialogs = CollectionsApi.query('service_dialogs/' + dialogId, options);
    const resolveService = CollectionsApi.get('services', $stateParams.serviceId, {attributes: ['picture', 'picture.image_href']});

    Promise.all([resolveDialogs, resolveService]).then((data) => {
      const SERVICE_RESPONSE = 1;
      const DIALOGS_RESPONSE = 0;
      vm.dialogId = data[DIALOGS_RESPONSE].id;
      vm.dialogs = data[DIALOGS_RESPONSE].content;
      vm.service = data[SERVICE_RESPONSE];
      vm.loading = false;
     
      DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

      var dialogUrl = 'service_dialogs/';

      angular.forEach(allDialogFields, function (dialogField) {
        dialogField.refreshSingleDialogField = function () {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, vm.dialogId );
        };
      });

      AutoRefresh.listenForAutoRefresh(
        allDialogFields,
        autoRefreshableDialogFields,
        dialogUrl,
        vm.dialogId,
        DialogFieldRefresh.refreshSingleDialogField
      ); 
    });
  }
  init();

/* 
  DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

  var dialogUrl = 'service_dialogs/';

  angular.forEach(allDialogFields, function(dialogField) {
    dialogField.refreshSingleDialogField = function() {
      DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, dialog.id);
    };
  });

  AutoRefresh.listenForAutoRefresh(
    allDialogFields,
    autoRefreshableDialogFields,
    dialogUrl,
    dialog.id,
    DialogFieldRefresh.refreshSingleDialogField
  ); */

  function submitCustomButton() {
    const dialogFieldData = {};
    const buttonClass = vm.button.applies_to_class.toLowerCase();
    const collection = buttonClass === 'service' ? 'services' : buttonClass === 'vm' ? 'vms' : null;

    allDialogFields.forEach((dialogField) => {
      dialogFieldData[dialogField.name] = dialogField.default_value;
    });

    CollectionsApi.post(
      collection,
      $stateParams.serviceId,
      {},
      angular.toJson({action: $stateParams.button.name, resource: dialogFieldData})
    ).then(submitSuccess, submitFailure);

    function submitSuccess(result) {
      EventNotifications.success(result.message);
      $state.go('services.details', {serviceId: $stateParams.serviceId});
    }

    function submitFailure(result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result.data.error.message);
    }
  }
}
