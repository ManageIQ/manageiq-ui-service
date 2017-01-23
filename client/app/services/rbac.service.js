/** @ngInject */
export function RBACFactory() {
  var features = {};

  var service = {
    set: set,
    has: has,
    all: all,
  };

  return service;

  function set(productFeatures) {
    features = productFeatures || {};
  }

  function has(feature) {
    return feature in features;
  }

  function all() {
    return features;
  }
}
