/** @ngInject */
export function BaseModalFactory ($uibModal) {
  return {
    open: openModal
  }

  function openModal (overrideOptions) {
    var defaultOptions = {
      size: 'md'
    }
    var modalOptions = angular.merge({}, defaultOptions, overrideOptions)
    var modal = $uibModal.open(modalOptions)

    return modal.result
  }
}
