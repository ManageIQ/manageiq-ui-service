import applicationTemplate from '../layouts/application.html';
import blankTemplate from '../layouts/blank.html';

/** @ngInject */
export function layoutInit(routerHelper) {
  routerHelper.configureStates(getLayouts());
}

function getLayouts() {
  return {
    'blank': {
      abstract: true,
      templateUrl: blankTemplate,
    },
    'application': {
      abstract: true,
      templateUrl: applicationTemplate,
      onEnter: enterApplication,
      onExit: exitApplication,
    },
  };
}

/** @ngInject */
function enterApplication(Polling, lodash, NavCounts, Navigation, RBAC) {
  // Application layout displays the navigation which might have items that require polling to update the counts
  const navFeatures = RBAC.getNavFeatures();
  angular.forEach(NavCounts.counts, updateCount);
  angular.forEach(Navigation.items, (value, key) => {
    navFeatures[key] = lodash.merge(value, navFeatures[key]);
  });
  RBAC.setNavFeatures(navFeatures);

  function updateCount(count, key) {
    if (angular.isDefined(navFeatures[key]) && navFeatures[key].show) {
      count.func();
      if (count.interval) {
        Polling.start(key, count.func, count.interval);
      }
    }
  }
}

/** @ngInject */
function exitApplication(lodash, Polling, NavCounts) {
  // Remove all of the navigation polls
  angular.forEach(lodash.keys(NavCounts.counts), Polling.stop);
}
