/** @ngInject */
export function layoutInit(routerHelper) {
  routerHelper.configureStates(getLayouts());
}

function getLayouts() {
  return {
    'blank': {
      abstract: true,
      templateUrl: 'app/layouts/blank.html',
    },
    'application': {
      abstract: true,
      templateUrl: 'app/layouts/application.html',
      onEnter: enterApplication,
      onExit: exitApplication,
    },
  };
}

/** @ngInject */
function enterApplication(Polling, lodash, NavCounts, Navigation, RBAC) {
  // Application layout displays the navigation which might have items that require polling to update the counts
  var navFeatures = RBAC.getNavFeatures();
  var actionFeatures = RBAC.getActionFeatures();
  angular.forEach(NavCounts.counts, updateCount);
  angular.forEach(Navigation.items, function(value, key) {
    navFeatures[key] = lodash.merge(value, navFeatures[key]);
    angular.forEach(value.secondary, function(secondaryValue, secondaryKey) {
      actionFeatures[secondaryKey] = lodash.merge(secondaryValue, actionFeatures[secondaryKey]);
    });
  });
  RBAC.setNavFeatures(navFeatures);
  RBAC.setActionFeatures(actionFeatures);

  function updateCount(count, key) {
    switch (key) {
      case 'rules':
      case 'dialogs':
        if (navFeatures.dialogs.show === false) {
          return false;
        }
        break;
      case 'profiles':
        if (navFeatures.administration.show === false) {
          return false;
        }
        break;
    }
    count.func();
    if (count.interval) {
      Polling.start(key, count.func, count.interval);
    }
  }
}

/** @ngInject */
function exitApplication(lodash, Polling, NavCounts) {
  // Remove all of the navigation polls
  angular.forEach(lodash.keys(NavCounts.counts), Polling.stop);
}
