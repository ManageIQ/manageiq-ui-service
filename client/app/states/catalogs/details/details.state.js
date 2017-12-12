/* eslint-disable arrow-body-style */
import templateUrl from './details.html';

/** @ngInject */
export function CatalogsDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'catalogs.details': {
      url: '/:serviceTemplateId',
      templateUrl,
      controller: Controller,
      controllerAs: 'vm',
      title: N_('Service Template Details'),
    },
  };
}

/** @ngInject */
function Controller($stateParams, CollectionsApi, EventNotifications, DialogFieldRefresh, AutoRefresh, ShoppingCart) {
  var vm = this;
  var autoRefreshableDialogFields = [];
  var allDialogFields = [];

  let dialogs = {};
  const serviceTemplate = {};
  let serviceRequest = {};

  function init() {
    vm.loading = true;
    vm.addToCart = addToCart;
    vm.cartAllowed = ShoppingCart.allowed;
    vm.addToCartEnabled = false;
    vm.alreadyInCart = alreadyInCart;
    vm.addToCartDisabled = addToCartDisabled;

    vm.dialogData = {};

    const serviceRequestPromise = () => {
      return new Promise((resolve, _reject) => {
        if ($stateParams.serviceRequestId) {
          CollectionsApi.get('requests', $stateParams.serviceRequestId, {}).then((data) => { resolve(data); });
        } else {
          resolve(false);
        }
      });
    };
    serviceRequestPromise().then((resolvedServiceRequest) => {
      serviceRequest = resolvedServiceRequest;

      const dialogRequest = new Promise((resolve, _reject) => {
        const options = { expand: 'resources', attributes: 'content' };
        let serviceTemplateId = $stateParams.serviceTemplateId;
        if (!serviceTemplateId) {
          serviceTemplateId = serviceRequest.source_id;
        }
        CollectionsApi.query('service_templates/' + serviceTemplateId + '/service_dialogs', options).then((resolvedDialogs) => {
          resolve(resolvedDialogs);
        });
      });

      const serviceTemplateRequest = new Promise((resolve, _reject) => {
        let serviceTemplateId = $stateParams.serviceTemplateId;
        if (!serviceTemplateId) {
          serviceTemplateId = serviceRequest.source_id;
        }
        var options = { attributes: ['picture', 'picture.image_href'] };
        CollectionsApi.get('service_templates', serviceTemplateId, options).then((data) => {
          resolve(data);
        });
      });
      const allPromises = [dialogRequest, serviceTemplateRequest];
      Promise.all(allPromises).then((data) => {
        const SERVICE_TEMPLATE_RESPONSE = 1;
        const DIALOGS_RESPONSE = 0;
        dialogs = data[DIALOGS_RESPONSE];
        vm.dialogs = dialogs.resources[0].content;
        vm.serviceTemplate = data[SERVICE_TEMPLATE_RESPONSE];
        vm.dialogUrl = `service_catalogs/${vm.serviceTemplate.service_template_catalog_id}/service_templates`;
        if (dialogs.subcount > 0) {
          DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);
                   
          angular.forEach(allDialogFields, function (dialogField) {
            dialogField.refreshSingleDialogField = function () {
              DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, vm.dialogUrl, vm.serviceTemplate.id);
            };
          });
          
          AutoRefresh.listenForAutoRefresh(
            allDialogFields,
            autoRefreshableDialogFields,
            vm.dialogUrl,
            vm.serviceTemplate.id,
            DialogFieldRefresh.refreshSingleDialogField
          );
        }
        vm.loading = false;
      });
    });
  }

  init();
  function addToCartDisabled() {
    return (!vm.cartAllowed() || vm.addingToCart) || anyDialogsBeingRefreshed();
  }

  function anyDialogsBeingRefreshed() {
    function checkRefreshing(dialogField) {
      return dialogField.beingRefreshed;
    }

    return allDialogFields.some(checkRefreshing);
  }

  function dataForSubmit(href) {
    var dialogFieldData = {};
    dialogFieldData[href] = '/api/service_templates/' + serviceTemplate.id;

    angular.forEach(allDialogFields, function(dialogField) {
      if ((dialogField.type === "DialogFieldTagControl" || dialogField.type === "DialogFieldDropDownList")
        && dialogField.default_value instanceof Array) {
        dialogFieldData[dialogField.name] = dialogField.default_value.join();
      } else {
        dialogFieldData[dialogField.name] = dialogField.default_value;
      }
    });

    return dialogFieldData;
  }


  function alreadyInCart() {
    return ShoppingCart.isDuplicate(dataForSubmit('service_template_href'));
  }

  function addToCart() {
    if (!ShoppingCart.allowed()) {
      return;
    }

    var dialogFieldData = dataForSubmit('service_template_href');

    vm.addingToCart = true;

    ShoppingCart.add({
      description: vm.serviceTemplate.name,
      data: dialogFieldData,
    })
      .then(addSuccess, addFailure)
      .then(function() {
        vm.addingToCart = false;
      });

    function addSuccess(result) {
      if (result.duplicate) {
        EventNotifications.success(__("Item added to shopping cart, but it's a duplicate of an existing item"));
      } else {
        EventNotifications.success(__("Item added to shopping cart"));
      }
    }

    function addFailure(result) {
      var errors = result.split(",");
      for (var i = 0; i < errors.length; ++i) {
        EventNotifications.error(__("There was an error adding to shopping cart: ") + errors[i]);
      }
    }
  }
}
