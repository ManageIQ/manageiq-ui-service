/** @ngInject */
export function ApplianceInfo() {
  let applianceInfo = {};

  return {
    get: get,
    set: set,
  };

  function get() {
    return applianceInfo;
  }

  function set(data) {
    applianceInfo = {
      copyright: data.product_info.copyright,
      supportWebsiteText: data.product_info.support_website_text,
      supportWebsite: data.product_info.support_website,
      user: data.identity.name,
      role: data.identity.role,
      version: data.server_info.version + '.' + data.server_info.build,
      server: data.server_info.appliance,
      asyncNotify: data.settings.asynchronous_notifications,
    };
  }
}
