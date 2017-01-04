(function() {
  'use strict';

  angular.module('app.services')
    .factory('DialogEditor', DialogEditorFactory);

  /** @ngInject */
  function DialogEditorFactory() {
    var service = {
      data: {},
      activeTab: 0,
    };

    /**
     * Store data passed in parameter
     *
     * Parameter: data -- nested object containing data of the dialog
     */
    service.setData = function(data) {
      service.data = data;
    };

    /**
     * Return dialog id loaded at service
     */
    service.getDialogId = function() {
      return service.data.content[0].id;
    };

    /**
     * Return dialog label loaded at service
     */
    service.getDialogLabel = function() {
      return service.data.content[0].label;
    };

    /**
     * Return dialog description loaded at service
     */
    service.getDialogDescription = function() {
      return service.data.content[0].description;
    };

    /**
     * Return dialog tabs loaded at service
     */
    service.getDialogTabs = function() {
      return service.data.content[0].dialog_tabs;
    };

    /**
     * Update positions for elements in array
     *
     * Parameter: elements -- array of elements to sort
     */
    service.updatePositions = function(elements) {
      if (elements.length !== 0) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].position = i;
        }
      }
    };

    return service;
  }
})();
