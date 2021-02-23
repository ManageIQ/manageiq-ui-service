import gitHash from '/version.json';

/** @ngInject */
export function ApplianceInfo($sessionStorage) {
  return {
    get,
    set,
  };

  function get() {
    return $sessionStorage.applianceInfo || {};
  }

  function set(data) {
    $sessionStorage.applianceInfo = {
      copyright: data.product_info.copyright,
      supportWebsiteText: data.product_info.support_website_text,
      supportWebsite: data.product_info.support_website,
      user: data.identity.name,
      role: data.identity.role,
      suiVersion: gitHash && gitHash.gitCommit || '',
      miqVersion: data.server_info.version + '.' + data.server_info.build,
      server: data.server_info.appliance,
      asyncNotify: data.settings.asynchronous_notifications || true,
      nameFull: data.product_info.name_full,
      brand: data.product_info.branding_info.brand,
      favicon: data.product_info.branding_info.favicon,
      logo: data.product_info.branding_info.logo,
    };
  }
}
