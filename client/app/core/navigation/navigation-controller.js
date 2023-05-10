/** @ngInject */
export function NavigationController (Text, Navigation, Session, API_BASE, ShoppingCart, $scope, $uibModal, $state, EventNotifications, ApplianceInfo, CollectionsApi, RBAC, Language, lodash, $rootScope, sprintf) {
  const vm = this
  vm.language = ''
  const destroy = $scope.$on('shoppingCartUpdated', refresh)
  const destroyCart = $scope.$on('shoppingCartUpdated', refreshCart)
  vm.$doCheck = () => {
    const currentLanguage = Language.chosen.code
    if (!lodash.isEqual(vm.language, currentLanguage)) {
      vm.language = lodash.cloneDeep(currentLanguage)
      vm.items = Navigation.init()
    }

    if (!lodash.isEqual(vm.items, Navigation.get())) {
      if (!RBAC.suiAuthorized()) {
        Session.privilegesError = true
        $state.go('logout')
      }
      vm.items = Navigation.get()
    }

    if ($state.name === undefined) { // This occurs when you refresh the browser
      vm.items.map((item) => {
        item.isActive = $state.includes(item.state)
      })
    }
  }

  const destroyNotifications = $scope.$watch(function() {
    return EventNotifications.state().groups;
  }, refreshNotifications, true);

  const destroyToast = $scope.$watch(function() {
    return EventNotifications.state().toastNotifications;
  }, refreshToast, true);

  const applianceInfo = ApplianceInfo.get()
  $rootScope.favicon = applianceInfo.favicon

  vm.language = Language.chosen.code

  $scope.$on('destroy', function () {
    destroyCart()
    destroyNotifications()
    destroyToast()
    destroy()
  })

  activate()

  function activate () {
    vm.permissions = {
      help: {
        about: RBAC.has('about'),
        documentation: RBAC.has('documentation')
      },
      suiAppLauncher: RBAC.has(RBAC.FEATURES.CORE.APP_LAUNCHER),
      suiNotifications: RBAC.has(RBAC.FEATURES.CORE.NOTIFICATIONS),
      suiLanguage: RBAC.has(RBAC.FEATURES.CORE.LANGUAGE),
      helpMenu: RBAC.hasAny(['about', 'product', 'documentation'])
    }
    EventNotifications.setToastDisplay(vm.permissions.suiNotifications)
    const appBasePath = process.env.NODE_ENV === 'production' ? '' : 'assets/'
    angular.extend(vm, {
      state: Navigation.state,
      text: Text.app,
      user: Session.currentUser,
      API_BASE: API_BASE,
      switchGroup: switchGroup,
      documentation: '/support/index?support_tab=about',
      items: [],
      notificationsDrawerShown: false,
      newNotifications: false,
      html: {
        heading: `${appBasePath}html/heading.html`,
        notificationBody: `${appBasePath}html/notification-body.html`,
        notificationFooter: `${appBasePath}html/notification-footer.html`,
      },
      handleItemClick: handleItemClick,
      toggleNotificationsList: () => { vm.notificationsDrawerShown = !vm.notificationsDrawerShown },
      updateViewingToast: updateViewingToast,
      handleDismissToast: handleDismissToast,
      getNotficationStatusIconClass: getNotficationStatusIconClass,
      markNotificationRead: markNotificationRead,
      clearNotification: clearNotification,
      clearAllNotifications: clearAllNotifications,
      markAllRead: markAllRead,
      shoppingCart: shoppingCart(),
      about: about(),
      sites: sites(),
      applianceInfo: applianceInfo
    })

    CollectionsApi.query('settings/help_menu/documentation').then((data) => {
      const href = data.help_menu && data.help_menu.documentation && data.help_menu.documentation.href;
      if (! href) {
        return;
      }

      // fixes "http://localhost:3000/api/http://www.google.com"
      const matches = href.match(/http.*(http.*)/);
      vm.documentation = matches[1] || href;
    });

    vm.items = Navigation.init()
    refresh()
    if (ShoppingCart.allowed()) {
      ShoppingCart.reload()
    }
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
      imgSrc: applianceInfo.logo,
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
    vm.notificationsIndicatorTooltip = sprintf(__('%d unread notifications'), vm.unreadNotificationCount)
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
        'action': 'set_current_group',
        'current_group': {'id': group.id}
      }).then(success, failure)
    }

    function success () {
      Session.setGroup(group)
      Session.getUserAuthorizations()
      vm.user = Session.currentUser
      $state.go('dashboard', {}, {reload: true})
    }

    function failure (response) {
      EventNotifications.error(__('Group switching error: ') + response.data.error.message)
    }
  }
}

