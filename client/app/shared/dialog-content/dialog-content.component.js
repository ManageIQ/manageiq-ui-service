/* eslint camelcase: "off" */
import './_dialog-content.sass';
import templateUrl from './dialog-content.html';

export const DialogContentComponent = {
  bindings: {
    dialog: '=',
    options: '=?',
    inputDisabled: '=?',
  },
  controller: DialogContentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function DialogContentController(API_BASE, lodash) {
  var vm = this;
  vm.$onInit = activate;
  vm.parsedOptions = {};
  vm.dateOptions = {
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
  };
  vm.supportedDialog = true;
  vm.API_BASE = API_BASE;

  function activate() {
    if (vm.options) {
      angular.forEach(vm.options, parseOptions);
    }
    if (angular.isDefined(vm.dialog) && angular.isArray(vm.dialog.dialog_tabs)) {
      vm.dialog.dialog_tabs.forEach(iterateBGroups);
    }
  }

  // Private functions
  function parseOptions(value, key) {
    vm.parsedOptions[key.replace('dialog_', '')] = value;
  }

  function iterateBGroups(item) {
    item.dialog_groups.forEach(iterateBFields);
  }

  function iterateBFields(item) {
    if (lodash.result(lodash.find(item.dialog_fields, {'dynamic': true}), 'name')
      || lodash.result(lodash.find(item.dialog_fields, {'type': 'DialogFieldTagControl'}), 'name')) {
      vm.supportedDialog = false;
    }
    if (Object.keys(vm.parsedOptions).length > 0) {
      item.dialog_fields.forEach(iterateDialogFields);
    }
  }

  function iterateDialogFields(item) {
    item.default_value = vm.parsedOptions[item.name];
  }
}
