import template from './tag-editor-modal.html';

/** @ngInject */
export function TagEditorFactory ($uibModal) {
  var modalService = {
    showModal: showModal
  }

  return modalService

  function showModal (services, tags) {
    var modalOptions = {
      template,
      controller: TagEditorModalController,
      controllerAs: 'vm',
      size: 'md',
      resolve: {
        services: resolveServices,
        tags: resolveTags
      }
    }
    var modal = $uibModal.open(modalOptions)

    return modal.result

    function resolveServices () {
      return services
    }

    function resolveTags () {
      return tags
    }
  }
}

/** @ngInject */
function TagEditorModalController (services, tags, $controller, $uibModalInstance,
                                  $state, TaggingService, EventNotifications) {
  const vm = this
  var base = $controller('BaseModalController', {
    $uibModalInstance: $uibModalInstance
  })
  angular.extend(vm, base)

  vm.save = save
  vm.services = angular.isArray(services) ? services : [services]
  vm.modalData = { tags: angular.copy(tags) }

  // Override
  function save () {
    return TaggingService.assignTags('services', vm.services, tags, vm.modalData.tags)
      .then(saveSuccess)
      .catch(saveFailure)

    function saveSuccess () {
      $uibModalInstance.close()
      EventNotifications.success(__('Tagging successful.'))
      $state.go($state.current, {}, {reload: true})
    }

    function saveFailure () {
      EventNotifications.error(__('There was an error tagging this service.'))
    }
  }
}
