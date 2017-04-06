import './_tag-list.sass';
import templateUrl from './tag-list.html';

export const TagListComponent = {
  bindings: {
    dismissible: '<?',
    tags: '<',
  },
  controller: TagListController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function TagListController($scope) {
  const vm = this;

  vm.emitEvent = function() {
    $scope.$emit('tag.dismissed');
  };
}
