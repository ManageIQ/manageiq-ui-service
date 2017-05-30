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
      resolve: {
        dialogs: resolveDialogs,
        serviceTemplate: resolveServiceTemplate,
      },
    },
  };
}

/** @ngInject */
function resolveServiceTemplate($stateParams, CollectionsApi) {
  var options = {attributes: ['picture', 'picture.image_href']};

  return CollectionsApi.get('service_templates', $stateParams.serviceTemplateId, options);
}

/** @ngInject */
function resolveDialogs($stateParams, CollectionsApi) {
  var options = {expand: 'resources', attributes: 'content'};

  return CollectionsApi.query('service_templates/' + $stateParams.serviceTemplateId + '/service_dialogs', options);
}

/** @ngInject */
function Controller(dialogs, serviceTemplate, EventNotifications, DialogFieldRefresh, ShoppingCart) {
  var vm = this;

  vm.serviceTemplate = serviceTemplate;

  if (dialogs.subcount > 0) {
    vm.dialogs = dialogs.resources[0].content;
  }

  vm.addToCart = addToCart;
  vm.cartAllowed = ShoppingCart.allowed;
  vm.alreadyInCart = alreadyInCart;
  vm.addToCartDisabled = addToCartDisabled;

  var autoRefreshableDialogFields = [];
  var allDialogFields = [];

  DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

  var dialogUrl = 'service_catalogs/' + serviceTemplate.service_template_catalog_id + '/service_templates';

  angular.forEach(allDialogFields, function(dialogField) {
    dialogField.refreshSingleDialogField = function() {
      DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, vm.serviceTemplate.id);
    };
  });

  DialogFieldRefresh.listenForAutoRefreshMessages(
    allDialogFields,
    autoRefreshableDialogFields,
    dialogUrl,
    vm.serviceTemplate.id
  );

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
