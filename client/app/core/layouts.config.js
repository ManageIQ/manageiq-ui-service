import applicationTemplate from '../layouts/application.html'
import blankTemplate from '../layouts/blank.html'

/** @ngInject */
export function layoutInit (routerHelper) {
  routerHelper.configureStates(getLayouts())
}

function getLayouts () {
  return {
    'blank': {
      abstract: true,
      templateUrl: blankTemplate
    },
    'application': {
      abstract: true,
      templateUrl: applicationTemplate,
      onEnter: enterApplication,
      onExit: exitApplication
    }
  }
}

/** @ngInject */
function enterApplication (Polling, lodash, RBAC) {
}

/** @ngInject */
function exitApplication (lodash, Polling) {
  // Remove all of the navigation polls
  Polling.stopAll()
}
