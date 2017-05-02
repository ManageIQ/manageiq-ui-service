/** @ngInject */
export function EventNotificationsFactory($timeout, lodash, CollectionsApi, Session, $log, ActionCable, ApplianceInfo) {
  const state = {};
  const toastDelay = 8 * 1000;

  const service = {
    init: init,
    state: getState,
    add: add,
    info: addInfo,
    success: addSuccess,
    error: addError,
    warn: addWarn,
    update: update,
    markRead: markRead,
    markUnread: markUnread,
    markAllRead: markAllRead,
    markAllUnread: markAllUnread,
    clear: clear,
    clearAll: clearAll,
    removeToast: removeToast,
    setViewingToast: setViewingToast,
    dismissToast: dismissToast,
  };

  return service;

  function init() {
    doReset();

    if (ApplianceInfo.get().asyncNotify) {
      const cable = ActionCable.createConsumer('/ws/notifications');

      cable.subscriptions.create('NotificationChannel', {
        disconnected: function() {
          const vm = this;
          Session.requestWsToken().then(null, function() {
            $log.warn('Unable to retrieve a valid ws_token!');
            // Disconnect permanently if the ws_token cannot be fetched
            vm.consumer.connection.close({allowReconnect: false});
          });
        },
        received: function(data) {
          $timeout(function() {
            const msg = miqFormatNotification(data.text, data.bindings);
            service.add('event', data.level, msg, {message: msg}, data.id);
          });
        },
      });
    }
  }

  function getState() {
    return state;
  }

  function doReset() {
    const eventTypes = ['info', 'success', 'error', 'warning'];

    function Group(type) {
      this.notificationType = type;
      this.heading = lodash.capitalize(type);
      this.unreadCount = 0;
      this.notifications = [];
    }

    state.groups = eventTypes.map((type) => new Group(type));
    state.unreadNotifications = false;
    state.toastNotifications = [];

    const options = {
      expand: 'resources',
      attributes: 'details',
    };
    CollectionsApi.query('notifications', options).then((result) => {
      result.resources.forEach((resource) => {
        const group = lodash.find(state.groups, {notificationType: resource.details.level}) || new Group(resource.details.level);
        importServerNotifications(group, resource);
      });
      updateUnreadCount();
    });

    function importServerNotifications(group, resource) {
      const msg = miqFormatNotification(resource.details.text, resource.details.bindings);
      group.notifications.unshift({
        id: resource.id,
        notificationType: resource.details.level,
        unread: !resource.seen,
        type: resource.details.level,
        message: msg,
        data: {
          message: msg,
        },
        href: resource.href,
        timeStamp: resource.details.created_at,
      });
    }
  }

  function add(notificationType, type, message, notificationData, id) {
    const group = lodash.find(state.groups, {notificationType: notificationType});
    const newNotification = {
      id: id,
      notificationType: notificationType,
      unread: angular.isDefined(notificationData) ? notificationData.unread : true,
      type: type,
      message: message,
      data: notificationData || {},
      href: id ? '/api/notifications/' + id : undefined,
      timeStamp: (new Date()).getTime(),
    };

    group.notifications.unshift(newNotification);
    updateUnreadCount();
    showToast(newNotification);
  }

  function addInfo(message, notificationData, id) {
    service.add('info', 'info', message, notificationData, id);
  }

  function addSuccess(message, notificationData, id) {
    service.add('success', 'success', message, notificationData, id);
  }

  function addError(message, notificationData, id) {
    service.add('error', 'danger', message, notificationData, id);
  }

  function addWarn(message, notificationData, id) {
    service.add('warning', 'warning', message, notificationData, id);
  }

  function update(notificationType, type, message, notificationData, id, showToast) {
    let notification;
    let group = lodash.find(state.groups, {notificationType: notificationType});

    if (group) {
      group = lodash.find(group.notifications, {id: id});

      if (notification) {
        if (showToast) {
          notification.unread = true;
        }
        notification.type = type;
        notification.message = message;
        notification.data = notificationData;
        notification.timeStamp = (new Date()).getTime();
        updateUnreadCount(group);
      }
    }

    if (showToast) {
      if (!notification) {
        notification = {
          type: type,
          message: message,
        };
      }

      showToast(notification);
    }
  }

  function updateNotificationRead(unread, notification, group) {
    if (notification) {
      notification.unread = unread;
      if (!unread) {
        service.removeToast(notification);
      }
    }
    if (group) {
      updateUnreadCount(group);
    } else {
      updateUnreadCount();
    }
  }

  function markRead(notification, group) {
    if (notification && notification.href) {
      CollectionsApi.post('notifications', notification.id, {}, {action: 'mark_as_seen'});
    }
    updateNotificationRead(false, notification, group);
  }

  function markUnread(notification, group) {
    updateNotificationRead(true, notification, group);
  }

  function markAllRead(group) {
    if (group) {
      var resources = group.notifications.map(function(notification) {
        notification.unread = false;
        service.removeToast(notification);

        return {href: notification.href};
      });
      if (resources.length > 0) {
        CollectionsApi.post('notifications', undefined, {}, {action: 'mark_as_seen', resources: resources});
      }
      updateUnreadCount(group);
    }
  }

  function markAllUnread(group) {
    if (group) {
      group.notifications.forEach(function(notification) {
        notification.unread = true;
      });
      updateUnreadCount(group);
    }
  }

  function clear(notification, group) {
    var index;

    if (!group) {
      group = lodash.find(state.groups, {notificationType: notification.notificationType});
    }

    if (group) {
      index = group.notifications.indexOf(notification);
      if (index > -1) {
        group.notifications.splice(index, 1);
        service.removeToast(notification);
        if (notification.href) {
          CollectionsApi.delete('notifications', notification.id);
        }
        updateUnreadCount(group);
      }
    }
  }

  function clearAll(group) {
    if (group) {
      var resources = group.notifications.map(function(notification) {
        service.removeToast(notification);

        return {href: notification.href};
      });

      if (resources.length > 0) {
        CollectionsApi.post('notifications', undefined, {}, {action: 'delete', resources: resources});
      }

      group.notifications = [];
      updateUnreadCount(group);
    }
  }

  function removeToast(notification) {
    var index = state.toastNotifications.indexOf(notification);
    if (index > -1) {
      state.toastNotifications.splice(index, 1);
    }
  }

  function setViewingToast(notification, viewing) {
    notification.viewing = viewing;
    if (!viewing && !notification.show) {
      removeToast(notification);
    }
  }

  function dismissToast(notification) {
    notification.show = false;
    removeToast(notification);
    service.markRead(notification);
  }


// Private
  function showToast(notification) {
    notification.show = true;
    notification.persistent = notification.data.persistent || notification.type === 'danger' || notification.type === 'error';
    state.toastNotifications.push(notification);

    // any toast notifications with out 'danger' or 'error' status are automatically removed after a delay
    if (!notification.persistent) {
      notification.viewing = false;
      $timeout(function() {
        notification.show = false;
        if (!notification.viewing) {
          removeToast(notification);
        }
      }, notification.data.toastDelay || toastDelay);
    }
  }

  function updateUnreadCount(group) {
    if (group) {
      update(group);
    } else {
      state.groups.forEach((group) => {
        update(group);
      });
    }

    function update(group) {
      group.unreadCount = group.notifications.filter((notification) => notification.unread).length;
      state.unreadNotifications = angular.isDefined(lodash.find(state.groups, function(group) {
        return group.unreadCount > 0;
      }));
    }
  }

  function miqFormatNotification(text, bindings) {
    var str = __(text);
    lodash.each(bindings, function(value, key) {
      str = str.replace(new RegExp('%{' + key + '}', 'g'), value.text);
    });

    return str;
  }
}
