/* eslint camelcase: "off" */
/* eslint no-cond-assign: "off" */
(function() {
  'use strict';

  angular.module('app.services')
    .factory('DialogsState', DialogStateFactory);

  /** @ngInject */
  function DialogStateFactory(ListConfiguration) {
    var dialog = {};

    ListConfiguration.setupListFunctions(dialog, {id: 'label', title: __('Name'), sortType: 'alpha'});
    
    return dialog;
  }
})();
