/* eslint camelcase: "off" */
/* eslint no-cond-assign: "off" */

/** @ngInject */
export function DialogStateFactory(ListConfiguration) {
  var dialog = {};

  ListConfiguration.setupListFunctions(dialog, {id: 'label', title: __('Name'), sortType: 'alpha'});

  return dialog;
}
