import 'components-jqueryui/ui/widgets/draggable.js';
import 'components-jqueryui/ui/widgets/droppable.js';

angular.module('app.states')
  .run(appRun);

/** @ngInject */
function appRun(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'designer.blueprints': {
      parent: 'application',
      url: '/blueprints',
      redirectTo: 'designer.blueprints.list',
      template: '<ui-view></ui-view>',
    },
  };
}
