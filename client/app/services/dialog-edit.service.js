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
     * Parameter: data -- nested object containing data
     */
    service.setData = function(data) {
      service.data = data;
    };

    /**
     * Return data loaded at service
     */
    service.getData = function() {
      return service.data;
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
