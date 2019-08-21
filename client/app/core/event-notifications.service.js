/** @ngInject */
export function EventNotificationsFactory ($log, $timeout, lodash, CollectionsApi, RBAC, ApplianceInfo, ActionCable,
                                           Session, sprintf) {
  const state = {}
  const toastDelay = 8 * 1000
  const service = {
    state: getState,
    batch: batchAdd,
    info: addInfo,
    success: addSuccess,
    error: addError,
    warn: addWarn,
    markRead: markRead,
    markUnread: markUnread,
    markAllRead: markAllRead,
    markAllUnread: markAllUnread,
    clear: clear,
    clearAll: clearAll,
    setViewingToast: setViewingToast,
    dismissToast: dismissToast,
    setToastDisplay: setToastDisplay
  }

  notificationsInit()
  actionCableInit()

  return service

  function getState () {
    return state
  }

  function batchAdd (events, successMsg = '', failMsg = '') {
    const displayToast = events.length <= 6
    events.forEach(function (event) {
      if (event.success) {
        service.success(successMsg + ' ' + event.message)
      } else {
        service.error(failMsg + ' ' + event.message)
      }
    })
    if (!displayToast) {
      state.toastNotifications = []
      service.info(__('Review the notification tray for results of this batch operation'))
    }
  }

  function addInfo (message, notificationData, id) {
    add('info', 'info', message, notificationData, id)
  }

  function addSuccess (message, notificationData, id) {
    add('success', 'success', message, notificationData, id)
  }

  function addError (message, notificationData, id, displayToast) {
    add('error', 'danger', message, notificationData, id, displayToast)
  }

  function addWarn (message, notificationData, id) {
    add('warning', 'warning', message, notificationData, id)
  }

  function updateNotificationRead (unread, notification, group) {
    if (notification) {
      notification.unread = unread
      if (!unread) {
        removeToast(notification)
      }
    }
    updateUnreadCount(group)
  }

  function markRead (notification, group) {
    if (notification && notification.href) {
      CollectionsApi.post('notifications', notification.id, {}, {action: 'mark_as_seen'})
    }
    updateNotificationRead(false, notification, group)
  }

  function markUnread (notification, group) {
    updateNotificationRead(true, notification, group)
  }

  function markAllRead (group) {
    if (group) {
      const resources = group.notifications.map(function (notification) {
        notification.unread = false
        removeToast(notification)

        return {href: notification.href}
      })
      if (resources.length > 0) {
        CollectionsApi.post('notifications', undefined, {}, {action: 'mark_as_seen', resources: resources})
      }
      updateUnreadCount(group)
    }
  }

  function markAllUnread (group) {
    if (group) {
      group.notifications.forEach(function (notification) {
        notification.unread = true
      })
      updateUnreadCount(group)
    }
  }

  function clear (notification, group) {
    let index

    if (!group) {
      group = lodash.find(state.groups, {notificationType: notification.notificationType})
    }

    if (group) {
      index = group.notifications.indexOf(notification)
      if (index > -1) {
        group.notifications.splice(index, 1)
        removeToast(notification)
        if (notification.href) {
          CollectionsApi.delete('notifications', notification.id)
        }
        updateUnreadCount(group)
      }
    }
  }

  function clearAll (group) {
    if (group) {
      const resources = group.notifications.map(function (notification) {
        removeToast(notification)

        return {href: notification.href}
      })

      if (resources.length > 0) {
        CollectionsApi.post('notifications', undefined, {}, {action: 'delete', resources: resources})
      }

      group.notifications = []
      updateUnreadCount(group)
    }
  }

  function setViewingToast (notification, viewing) {
    notification.viewing = viewing
    if (!viewing && !notification.show) {
      removeToast(notification)
    }
  }

  function dismissToast (notification) {
    notification.show = false
    removeToast(notification)
    service.markRead(notification)
  }

  function setToastDisplay (enabled) {
    state.toastsEnabled = enabled
  }

  // Private
  function add (notificationType, type, message, notificationData, id) {
    if (RBAC.has(RBAC.FEATURES.CORE.NOTIFICATIONS)) {
      const group = lodash.find(state.groups, {notificationType: notificationType})
      const newNotification = {
        id: id,
        notificationType: notificationType,
        unread: angular.isDefined(notificationData) ? notificationData.unread : true,
        type: type,
        message: message,
        data: notificationData || {},
        href: id ? '/api/notifications/' + id : undefined,
        timeStamp: (new Date()).getTime()
      }

      group.notifications.unshift(newNotification)
      updateUnreadCount(group)
      showToast(newNotification)
    }
  }

  function miqFormatNotification (text, bindings) {
    let str = __(text)
    lodash.each(bindings, function (value, key) {
      str = str.replace(new RegExp('%{' + key + '}', 'g'), value.text)
    })

    return str
  }

  function notificationsInit () {
    const eventTypes = [['info', __('Info')], ['success', __('Success')], ['error', __('Error')], ['warning', __('Warning')]]

    function Group (type) {
      this.notificationType = type[0]
      this.heading = type[1]
      this.unreadCount = 0
      this.notifications = []
    }

    state.groups = eventTypes.map((type) => new Group(type))
    state.unreadNotifications = false
    state.toastNotifications = []

    const options = {
      expand: 'resources',
      attributes: 'details'
    }
    if (RBAC.has(RBAC.FEATURES.CORE.NOTIFICATIONS)) {
      CollectionsApi.query('notifications', options).then((result) => {
        result.resources.forEach((resource) => {
          const group = lodash.find(state.groups, {notificationType: resource.details.level}) || new Group(resource.details.level)
          importServerNotifications(group, resource)
        })
        updateUnreadCount()
      })
    }

    function importServerNotifications (group, resource) {
      const msg = miqFormatNotification(resource.details.text, resource.details.bindings)
      group.notifications.unshift({
        id: resource.id,
        notificationType: resource.details.level,
        unread: !resource.seen,
        type: resource.details.level,
        message: msg,
        data: {
          message: msg
        },
        href: resource.href,
        timeStamp: resource.details.created_at
      })
    }
  }

  function actionCableInit () {
    if (ApplianceInfo.get().asyncNotify) {
      const cable = ActionCable.createConsumer('/ws/notifications')
      cable.subscriptions.create('NotificationChannel', {
        disconnected: () => {
          const vm = this
          Session.requestWsToken().then(null, () => {
            $log.warn('Unable to retrieve a valid ws_token!')
            // Disconnect permanently if the ws_token cannot be fetched
            vm.consumer.connection.close({allowReconnect: false})
          })
        },
        received: (data) => {
          const msg = miqFormatNotification(data.text, data.bindings)
          add(data.level, data.level === 'error' ? 'danger' : data.level, msg, {message: msg}, data.id)
        }
      })
    }
  }

  function removeToast (notification) {
    const index = state.toastNotifications.indexOf(notification)
    if (index > -1) {
      state.toastNotifications.splice(index, 1)
    }
  }

  function showToast (notification) {
    if (!state.toastsEnabled) {
      return
    }
    notification.show = true
    notification.persistent = notification.data.persistent || notification.type === 'danger' || notification.type === 'error'
    state.toastNotifications.push(notification)

    // any toast notifications with out 'danger' or 'error' status are automatically removed after a delay
    if (!notification.persistent) {
      notification.viewing = false
      $timeout(function () {
        notification.show = false
        if (!notification.viewing) {
          removeToast(notification)
        }
      }, notification.data.toastDelay || toastDelay)
    }
  }

  function updateUnreadCount (group) {
    if (group) {
      update(group)
    } else {
      state.groups.forEach((group) => {
        update(group)
      })
    }

    function update (group) {
      group.unreadCount = group.notifications.filter((notification) => notification.unread).length
      group.subHeading = sprintf(__('%d new notifications'), group.unreadCount)
      state.unreadNotifications = angular.isDefined(lodash.find(state.groups, function (group) {
        return group.unreadCount > 0
      }))
    }
  }
}
