import gitHash from '../../version/version.json'
/** @ngInject */
export function ApplianceInfo ($sessionStorage) {
  let applianceInfo = {}

  return {
    get: get,
    set: set
  }

  function get () {
    const defaultResponse = {
      asyncNotify: false
    }

    return (angular.isDefined($sessionStorage.applianceInfo) ? $sessionStorage.applianceInfo : defaultResponse)
  }

  function set (data) {
    applianceInfo = {
      copyright: data.product_info.copyright,
      supportWebsiteText: data.product_info.support_website_text,
      supportWebsite: data.product_info.support_website,
      user: data.identity.name,
      role: data.identity.role,
      suiVersion: gitHash.gitCommit,
      miqVersion: data.server_info.version + '.' + data.server_info.build,
      server: data.server_info.appliance,
      asyncNotify: data.settings.asynchronous_notifications
    }
    $sessionStorage.applianceInfo = applianceInfo
  }
}
