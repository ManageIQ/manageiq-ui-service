(function() {
  'use strict';

  angular.module('app.components')
    .component('tagEditor', {
      bindings: {},
      controller: TagEditorController,
      controllerAs: 'vm',
      templateUrl: 'app/components/tag-editor/tag-editor.html',
    });

  /** @ngInject */
  function TagEditorController(taggingService) {
    var vm = this;
    vm.$onInit = function() {
      vm.assignedTags = [];
      vm.tagCategories = [];

      taggingService.getTagCategories()
        .then(function(response) {
          vm.tagCategories = response;
        });
    }
  }
})();
