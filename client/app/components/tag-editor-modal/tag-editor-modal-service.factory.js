(function() {
  'use strict';

  angular.module('app.components')
    .factory('TagEditorModal', TagEditorFactory);

  /** @ngInject */
  function TagEditorFactory($uibModal) {
    var modalService = {
      showModal: showModal,
    };

    return modalService;

    function showModal(service, tags) {
      var modalOptions = {
        templateUrl: 'app/components/tag-editor-modal/tag-editor-modal.html',
        controller: TagEditorModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          service: resolveService,
          tags: resolveTags,
        },
      };
      var modal = $uibModal.open(modalOptions);

      return modal.result;

      function resolveService() {
        return service;
      }

      function resolveTags() {
        // taggingWidget needs tagsOfItems to have this shape
        return tags.resources.map(function(resource) {
          return {
            id: resource.id,
            name: resource.name,
            category: { id: resource.category.id },
            categorization: {
              displayName: resource.category.description + ': ' + resource.classification.description,
            },
          };
        });
      }
    }
  }

  /** @ngInject */
  function TagEditorModalController(service, tags, $controller, $uibModalInstance,
                                    $state, CollectionsApi, EventNotifications) {
    var vm = this;
    var base = $controller('BaseModalController', {
      $uibModalInstance: $uibModalInstance,
    });
    angular.extend(vm, base);

    vm.save = save;
    vm.modalData = { tags: angular.copy(tags) };

    // Override
    function save() {
      var tagNames = vm.modalData.tags.map(function(tag) {
        return tag.name;
      });

      var assignData = {
        action: 'assign',
        resources: tagNames.map(function(name) {
          return { name: name };
        }),
      };

      var unassignData = {
        action: 'unassign',
        resources: tags.filter(function(tag) {
          return tagNames.indexOf(tag.name) < 0;
        }).map(function(tag) {
          return { name: tag.name };
        }),
      };

      return CollectionsApi.post('services', service.id + '/tags', {}, assignData)
        .then(function(data) {
          if (unassignData.resources.length > 0) {
            return CollectionsApi.post('services', service.id + '/tags', {}, unassignData);
          } else {
            return data;
          }
        })
        .then(saveSuccess)
        .catch(saveFailure);

      function saveSuccess() {
        $uibModalInstance.close();
        EventNotifications.success(__('Tagging successful.'));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        EventNotifications.error(__('There was an error tagging this service.'));
      }
    }
  }
})();
