import RBACActions from '../actions/rbac.actions'
import NavActions from '../actions/nav.actions'
/** @ngInject */
export function RBACFactory (lodash, $ngRedux) {
  var navFeatures = {}
  let features = {}
  let currentRole

  const service = {
    all: all,
    set: set,
    has: has,
    hasAny: hasAny,
    hasRole: hasRole,
    setRole: setRole,
    getNavFeatures: getNavFeatures,
    navigationEnabled: navigationEnabled
  }

  function mapStateToThis (state) {
    return {
      rbac: state.rbac,
      nav: state.nav
    }
  }

  const vm = this
  vm.unsubscribe = $ngRedux.connect(mapStateToThis, RBACActions)(vm)
  features = vm.rbac
  return service

  function set (productFeatures) {
    features = productFeatures || {}
    const navPermissions = {
      services: {show: angular.isDefined(productFeatures.service_view)},
      orders: {show: angular.isDefined(productFeatures.svc_catalog_provision)},
      catalogs: {show: angular.isDefined(productFeatures.catalog_items_view)}
    }
    features.navPermissions = navPermissions
    // save to redux
    vm.addRBAC(features)
  }
  function has (feature) {
    return feature in features
  }

  function hasAny (permissions) {
    return permissions.some((feature) => angular.isDefined(features[feature]))
  }

  function hasRole (...roles) {
    return roles.some((role) => role === currentRole || role === '_ALL_')
  }

  function all () {
    return features
  }

  function setRole (newRole) {
    currentRole = newRole
  }

  function getNavFeatures () {
    return features.navPermissions
  }

  function navigationEnabled () {
    const rbac = vm.rbac.get('rbac')
    return lodash.some(rbac.navPermissions, (item) => item.show)
  }
}
