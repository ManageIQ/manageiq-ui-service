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

    function showModal(services, tags) {
      var modalOptions = {
        templateUrl: 'app/components/tag-editor-modal/tag-editor-modal.html',
        controller: TagEditorModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          services: resolveServices,
          tags: resolveTags,
        },
      };
      var modal = $uibModal.open(modalOptions);

      return modal.result;

      function resolveServices() {
        return services;
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
  function TagEditorModalController(services, tags, $controller, $uibModalInstance,
                                    $state, CollectionsApi, EventNotifications) {
    var vm = this;
    var base = $controller('BaseModalController', {
      $uibModalInstance: $uibModalInstance,
    });
    angular.extend(vm, base);

    vm.save = save;
    vm.services = Array.isArray(services) ? services : [services];
    vm.modalData = { tags: angular.copy(tags) };

    // Override
    function save() {
      var tagNames = vm.modalData.tags.map(function(tag) {
        return tag.name;
      });

      var assignPayload = {
        action: 'assign',
        resources: tagNames.map(function(name) {
          return { name: name };
        }),
      };

      var unassignPayload = {
        action: 'unassign',
        resources: tags.filter(function(tag) {
          return tagNames.indexOf(tag.name) < 0;
        }).map(function(tag) {
          return { name: tag.name };
        }),
      };

      vm.services.reduce(function(sequence, service) {
        return sequence.then(function(data) {
            if (assignPayload.resources.length > 0) {
              return CollectionsApi.post('services', service.id + '/tags', {}, assignPayload);
            } else {
              return data;
            }
          })
          .then(function(data) {
            if (unassignPayload.resources.length > 0) {
              return CollectionsApi.post('services', service.id + '/tags', {}, unassignPayload);
            } else {
              return data;
            }
          })
          .then(saveSuccess)
          .catch(saveFailure);
        }, Promise.resolve());

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
