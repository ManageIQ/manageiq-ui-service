/** @ngInject */
export function ProductInfo ($q) {
  var factory = {}
  factory.data = {}
  factory.promise = $q(function (resolve) {
    factory.set = function (data) {
      factory.data = {
        copyright: data.product_info.copyright,
        supportWebsiteText: data.product_info.support_website_text,
        supportWebsite: data.product_info.support_website
      }
      resolve(factory.data)

      return data
    }
  })

  return factory
}
