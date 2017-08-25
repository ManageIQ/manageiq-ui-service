/** @ngInject */
export function PollingFactory ($interval, $sessionStorage, lodash) {
  var service = {
    start: start,
    stop: stop,
    stopAll: stopAll,
    getPolls: getPolls
  }

  var polls = {}

  return service

  function getPolls () {
    return polls
  }

  function start (key, func, interval, limit) {
    var poll
    if (angular.isDefined($sessionStorage.pause)) {
      interval = $sessionStorage.pause
    }
    if (!polls[key]) {
      poll = $interval(func, interval, limit)
      polls[key] = poll
    }
  }

  function stop (key) {
    if (polls[key]) {
      $interval.cancel(polls[key])
      delete polls[key]
    }
  }

  function stopAll () {
    angular.forEach(lodash.keys(polls), stop)
  }
}
