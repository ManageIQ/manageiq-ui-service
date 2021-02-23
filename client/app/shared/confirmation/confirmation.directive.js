import './_confirmation.sass'
import template from './confirmation.html';

/** @ngInject */
export function ConfirmationDirective ($uibPosition, $window) {
  var directive = {
    restrict: 'AE',
    scope: {
      id: '@?confirmationId',
      position: '@?confirmationPosition',
      title: '@?confirmationTitle',
      message: '@?confirmationMessage',
      triggerOnValue: '=?confirmationTriggerValue',
      trigger: '@?confirmationTrigger',
      ok: '@?confirmationOkText',
      cancel: '@?confirmationCancelText',
      onOk: '&confirmationOnOk',
      onCancel: '&?confirmationOnCancel',
      okStyle: '@?confirmationOkStyle',
      confirmIf: '&?confirmationIf',
      showCancel: '=?confirmationShowCancel',
      itemsTitle: '@?confirmationItemsTitle',
      items: '=?confirmationItems',
      itemNameField: '@?confirmationItemNameField'
    },
    link: link,
    controller: ConfirmationController,
    controllerAs: 'vm',
    bindToController: true
  }

  return directive

  function link (scope, element, attrs, controller) {
    controller.activate({
      getOffset: getOffset,
      getPosition: getPosition,
      size: getSizeOfConfirmation()
    })

    if (angular.isDefined(controller.triggerOnValue)) {
      scope.$watch(function () {
        return controller.triggerOnValue
      },
      function (newValue) {
        if (newValue === true) {
          controller.onTrigger()
        }
      })
    } else {
      element.on(attrs.confirmationTrigger || 'click', controller.onTrigger)
    }

    function getOffset () {
      return $window.pageYOffset
    }

    function getPosition () {
      return $uibPosition.offset(element)
    }

    // Private

    function getSizeOfConfirmation () {
      var height, width
      var sizerMessage = attrs.confirmationMessage || __('For Sizing')
      var sizer = angular.element('<div class="confirmation__dialog"><div class="confirmation__content">' +
        '<div class="confirmation__body"><p class="confirmation_message">' + sizerMessage +
        '</p><div class="confirmation_buttons">' +
        '<button type="button" class="confirmation__button btn-rounded">' +
        __('For Sizing') +
        '</button>' +
        '</div></div></div></div>')

      sizer.css('visibility', 'hidden')
      element.parent().append(sizer)
      height = sizer.prop('offsetHeight')
      width = sizer.prop('offsetWidth')
      sizer.detach()

      return {
        height: height,
        width: width
      }
    }
  }

  /** @ngInject */
  function ConfirmationController ($scope, $uibModal, lodash) {
    const vm = this

    var modalOptions = {
      template,
      scope: $scope
    }

    vm.top = 0
    vm.left = 0

    vm.activate = activate
    vm.onTrigger = onTrigger

    vm.collapseItemsThreshold = 5
    vm.toggleShowItems = function () {
      vm.showItems = !vm.showItems
    }

    function activate (api) {
      angular.extend(vm, api)
      vm.position = angular.isDefined(vm.position) ? vm.position : 'top-center'
      vm.title = angular.isDefined(vm.title) ? vm.title : false
      vm.message = angular.isDefined(vm.message) ? vm.message : __('Are you sure you wish to proceed?')
      vm.ok = angular.isDefined(vm.ok) ? vm.ok : 'Ok'
      vm.cancel = angular.isDefined(vm.cancel) ? vm.cancel : __('Cancel')
      vm.onCancel = angular.isDefined(vm.onCancel) ? vm.onCancel : angular.noop
      vm.okClass = angular.isDefined(vm.okStyle) ? 'btn-' + vm.okStyle : ''
      vm.confirmIf = angular.isDefined(vm.confirmIf) ? vm.confirmIf : lodash.constant(true)
      vm.showCancel = angular.isDefined(vm.showCancel) ? vm.showCancel : true
    }

    function onTrigger () {
      var position = getModalPosition()
      var modal

      vm.showItems = false
      vm.useCollapse = angular.isArray(vm.items) && (vm.items.length > vm.collapseItemsThreshold)

      if (vm.confirmIf()) {
        vm.left = position.left
        vm.top = position.top - vm.getOffset()

        modal = $uibModal.open(modalOptions)
        modal.result.then(onOk, onCancel)
      } else {
        vm.onOk()
      }

      function onOk () {
        vm.onOk()
      }

      function onCancel () {
        vm.onCancel()
      }
    }

    // Grafted in from ui.bootstraps $uibPosition.positionElements()
    function getModalPosition () {
      var posParts = vm.position.split('-')
      var pos0 = posParts[0]
      var pos1 = posParts[1] || 'center'
      var hostElPos = vm.getPosition()
      var targetElPos = {}

      var targetElWidth = vm.size.width
      var targetElHeight = vm.size.height

      var shiftWidth = {
        center: widthCenter,
        left: widthLeft,
        right: widthRight
      }

      var shiftHeight = {
        center: heightCenter,
        top: heightTop,
        bottom: heightBottom
      }

      switch (pos0) {
        case 'right':
          targetElPos = {
            top: shiftHeight[pos1](),
            left: shiftWidth[pos0]()
          }
          break
        case 'left':
          targetElPos = {
            top: shiftHeight[pos1](),
            left: hostElPos.left - targetElWidth
          }
          break
        case 'bottom':
          targetElPos = {
            top: shiftHeight[pos0](),
            left: shiftWidth[pos1]()
          }
          break
        default:
          targetElPos = {
            top: hostElPos.top - targetElHeight,
            left: shiftWidth[pos1]()
          }
          break
      }

      return targetElPos

      function widthRight () {
        return hostElPos.left + hostElPos.width
      }

      function widthLeft () {
        return hostElPos.left
      }

      function widthCenter () {
        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2
      }

      function heightBottom () {
        return hostElPos.top + hostElPos.height
      }

      function heightTop () {
        return hostElPos.top
      }

      function heightCenter () {
        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2
      }
    }
  }
}
