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
function enterApplication(Polling, lodash, $state, NavCounts, Navigation) {
  // Application layout displays the navigation which might have items that require polling to update the counts
  angular.forEach(NavCounts.counts, updateCount);
  angular.forEach(Navigation.items, function(value, key) {
    lodash.merge(value, $state.navFeatures[key]);
    angular.forEach(value.secondary, function(secondaryValue, secondaryKey) {
      lodash.merge(secondaryValue, $state.actionFeatures[secondaryKey]);
    });
  });

  function updateCount(count, key) {
    switch (key) {
      case 'rules':
      case 'dialogs':
        if ($state.navFeatures.designer.show === false) {
          return false;
        }
        break;
      case 'profiles':
        if ($state.navFeatures.administration.show === false) {
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
