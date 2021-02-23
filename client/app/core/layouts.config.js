import applicationTemplate from '../layouts/application.html';
import blankTemplate from '../layouts/blank.html';

/** @ngInject */
export function layoutInit (routerHelper) {
  routerHelper.configureStates(getLayouts())
}

function getLayouts () {
  return {
    'blank': {
      abstract: true,
      template: blankTemplate,
    },
    'application': {
      abstract: true,
      template: applicationTemplate,
      onExit: exitApplication,
    },
  }
}

/** @ngInject */
function exitApplication (Polling) {
  // Remove all of the navigation polls
  Polling.stopAll()
}
