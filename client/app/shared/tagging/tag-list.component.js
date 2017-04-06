import './_tag-list.sass';
import templateUrl from './tag-list.html';

export const TagListComponent = {
  bindings: {
    dismissible: '<?',
    tags: '<',
  },
  controllerAs: 'vm',
  templateUrl,
};
