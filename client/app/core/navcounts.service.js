/** @ngInject */
export function NavCountsFactory() {
  var counts = {};

  var service = {
    add: add,
    counts: counts,
  };

  return service;

  function add(key, func, interval) {
    if (!counts[key]) {
      counts[key] = {
        func: func,
        interval: interval,
      };
    }
  }
}
