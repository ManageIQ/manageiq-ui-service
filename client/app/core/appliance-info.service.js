import gitHash from '../../version/version.json'

/** @ngInject */
export function ApplianceInfo ($sessionStorage) {
  let applianceInfo = {}

  return {
    get: get,
    set: set
  }

  function get () {
    const defaultResponse = {}

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
      asyncNotify: data.settings.asynchronous_notifications || true,
      nameFull: data.product_info.name_full,
      brand: data.product_info.branding_info.brand,
      favicon: data.product_info.branding_info.favicon,
      logo: data.product_info.branding_info.logo,
    }

    $sessionStorage.applianceInfo = applianceInfo
  }
}
