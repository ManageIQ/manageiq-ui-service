/** @ngInject */
export function NavigationController (Text, Navigation, Session, API_BASE, ShoppingCart, $scope, $uibModal, $state,
                                      EventNotifications, ApplianceInfo, CollectionsApi) {
  const vm = this

  const destroy = $scope.$on('shoppingCartUpdated', refresh)
  const destroyCart = $scope.$on('shoppingCartUpdated', refreshCart)
  const destroyNotifications = $scope.$watch(
    function () {
      return EventNotifications.state().groups
    },
    refreshNotifications, true)
  const destroyToast = $scope.$watch(
    function () {
      return EventNotifications.state().toastNotifications
    },
    refreshToast, true)
  const applianceInfo = ApplianceInfo.get()

  $scope.$on('destroy', function () {
    destroyCart()
    destroyNotifications()
    destroyToast()
    destroy()
  })
  $scope.$on('$stateChangeSuccess', function () {
    clearActiveItems()
    setActiveItems()
  })

  activate()

  function activate () {
    angular.extend(vm, {
      state: Navigation.state,
      text: Text.app,
      user: Session.currentUser,
      API_BASE: API_BASE,
      switchGroup: switchGroup,
      items: [],
      notificationsDrawerShown: false,
      newNotifications: false,
      titleHtml: 'app/components/notifications/drawer-title.html',
      headingHTML: 'app/components/notifications/heading.html',
      notificationHTML: 'app/components/notifications/notification-body.html',
      notificationFooterHTML: 'app/components/notifications/notification-footer.html',
      handleItemClick: handleItemClick,
      toggleNotificationsList: toggleNotificationsList,
      updateViewingToast: updateViewingToast,
      handleDismissToast: handleDismissToast,
      getNotficationStatusIconClass: getNotficationStatusIconClass,
      markNotificationRead: markNotificationRead,
      clearNotification: clearNotification,
      clearAllNotifications: clearAllNotifications,
      markAllRead: markAllRead,
      shoppingCart: shoppingCart(),
      about: about(),
      sites: sites()
    })
    getNavigationItems(Navigation.items)
    refresh()

    if (ShoppingCart.allowed()) {
      ShoppingCart.reload()
    }
    setActiveItems()
  }

  function shoppingCart () {
    return {
      count: 0,
      open: function () {
        return $uibModal.open({
          template: '<shopping-cart modal-instance="vm.modalInstance"></shopping-cart>',
          size: 'lg',
          controller: function ($uibModalInstance) {
            const vm = this
            vm.modalInstance = $uibModalInstance
          },
          controllerAs: 'vm',
          bindToController: true

        }).result
      },
      allowed: ShoppingCart.allowed
    }
  }

  function about () {
    return {
      isOpen: false,
      additionalInfo: '',
      imgAlt: __('Product logo'),
      imgSrc: 'images/login-screen-logo.png',
      title: Text.app.name,
      productInfo: [
        {name: __('Version: '), value: applianceInfo.miqVersion},
        {name: __('SUI Version: '), value: applianceInfo.suiVersion},
        {name: __('Server Name: '), value: applianceInfo.server},
        {name: __('User Name: '), value: applianceInfo.user},
        {name: __('User Role: '), value: applianceInfo.role}
      ],
      copyright: applianceInfo.copyright,
      supportWebsiteText: applianceInfo.supportWebsiteText,
      supportWebsite: applianceInfo.supportWebsite
    }
  }

  function sites () {
    return [{
      title: __('Administration UI'),
      tooltip: __('Log into the full administrative UI'),
      iconClass: 'fa-cogs',
      url: API_BASE
    }]
  }

  function clearActiveItems () {
    angular.forEach(vm.items, function (item) {
      item.isActive = false
      if (item.children) {
        angular.forEach(item.children, function (secondary) {
          secondary.isActive = false
          if (secondary.children) {
            secondary.children.forEach(function (tertiary) {
              tertiary.isActive = false
            })
          }
        })
      }
    })
  }

  function setActiveItems () {
    angular.forEach(vm.items, function (topLevel) {
      if ($state.includes(topLevel.state)) {
        topLevel.isActive = true
      }
      if (topLevel.children) {
        angular.forEach(topLevel.children, function (secondLevel) {
          if ($state.includes(secondLevel.state)) {
            secondLevel.isActive = true
            topLevel.isActive = true
          }
          if (secondLevel.children) {
            angular.forEach(secondLevel.children, function (thirdLevel) {
              if ($state.includes(thirdLevel.state)) {
                thirdLevel.isActive = true
                secondLevel.isActive = true
                topLevel.isActive = true
              }
            })
          }
        })
      }
    })
  }

  function getNavigationItems (items) {
    vm.items.splice(0, vm.items.length)
    angular.forEach(items, function (nextPrimary) {
      if (nextPrimary.show !== false) {
        getTextForNavigationItems(nextPrimary)
        vm.items.push(nextPrimary)
        if (nextPrimary.children) {
          nextPrimary.children.splice(0, nextPrimary.children.length)
        }
        if (nextPrimary.secondary) {
          if (angular.isUndefined(nextPrimary.children)) {
            nextPrimary.children = []
          }
          angular.forEach(nextPrimary.secondary, function (nextSecondary) {
            if (nextSecondary.show !== false) {
              getTextForNavigationItems(nextSecondary)
              nextPrimary.children.push(nextSecondary)
            }
          })
        }
      }
    })
  }

  function getTextForNavigationItems (navItem) {
    if (angular.isDefined(navItem.originalTitle)) {
      navItem.title = __(navItem.originalTitle)
    }
    if (angular.isDefined(navItem.badges)) {
      angular.forEach(navItem.badges, function (badge) {
        badge.tooltip = __(badge.originalTooltip)
      })
    }
  }

  function refreshCart () {
    vm.shoppingCart.count = ShoppingCart.count()
  }

  function refreshNotifications () {
    vm.notificationGroups = EventNotifications.state().groups
    vm.newNotifications = EventNotifications.state().unreadNotifications
    vm.unreadNotificationCount = 0
    angular.forEach(vm.notificationGroups, function (group) {
      vm.unreadNotificationCount += group.unreadCount
    })
    vm.notificationsIndicatorTooltip = __(vm.unreadNotificationCount + ' unread notifications')
  }

  function refreshToast () {
    vm.toastNotifications = EventNotifications.state().toastNotifications
  }

  function refresh () {
    refreshCart()
    refreshNotifications()
    refreshToast()
  }

  function handleItemClick (item) {
    $state.transitionTo(item.state)
  }

  function toggleNotificationsList () {
    vm.notificationsDrawerShown = !vm.notificationsDrawerShown
  }

  function getNotficationStatusIconClass (notification) {
    var retClass = ''
    if (notification && notification.type) {
      if (notification.type === 'info') {
        retClass = 'pficon pficon-info'
      } else if (notification.type === 'error') {
        retClass = 'pficon pficon-error-circle-o'
      } else if (notification.type === 'warning') {
        retClass = 'pficon pficon-warning-triangle-o'
      } else if (notification.type === 'success') {
        retClass = 'pficon pficon-ok'
      } else {
        retClass = 'pficon pficon-info'  // default to info
      }
    }

    return retClass
  }

  function markNotificationRead (notification, group) {
    EventNotifications.markRead(notification, group)
  }

  function clearNotification (notification, group) {
    EventNotifications.clear(notification, group)
  }

  function clearAllNotifications (group) {
    EventNotifications.clearAll(group)
  }

  function markAllRead (group) {
    EventNotifications.markAllRead(group)
  }

  function updateViewingToast (viewing, notification) {
    EventNotifications.setViewingToast(notification, viewing)
  }

  function handleDismissToast (notification) {
    EventNotifications.dismissToast(notification)
  }

  function switchGroup (group) {
    if (vm.user().user_href && group.id) {
      CollectionsApi.post('users', vm.user().user_href.split('/').pop(), {}, {
        'action': 'edit',
        'current_group': {'id': group.id}
      }).then(success, failure)
    }

    function success () {
      Session.setGroup(group)
      Session.loadUser()
      vm.user = Session.currentUser
      $state.go($state.current, {}, {reload: true})
    }

    function failure (response) {
      EventNotifications.error(__('Group switching error: ') + response.data.error.message)
    }
  }
}
