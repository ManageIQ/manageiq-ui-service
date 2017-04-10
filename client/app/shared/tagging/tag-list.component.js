import './_tag-list.sass';
import templateUrl from './tag-list.html';

export const TagListComponent = {
  bindings: {
    tags: '<',
    onRemoveTag: '&?',
  },
  controller: TagListController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function TagListController() {
  const vm = this;
  vm.dismissTag = function(tag) {
    vm.onRemoveTag({
      $event: { tag },
    });
  };
}
