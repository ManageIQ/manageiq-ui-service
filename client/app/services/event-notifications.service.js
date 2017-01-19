/** @ngInject */
export function EventNotificationsFactory($timeout, lodash, CollectionsApi, Session, logger, ActionCable) {
  var state = {};
  var toastDelay = 8 * 1000;

  var service = {
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
    showToast: showToast,
    removeToast: removeToast,
    setViewingToast: setViewingToast,
    dismissToast: dismissToast,
    state: function() {
      return state;
    },
  };

  var updateUnreadCount = function(group) {
    if (group) {
      group.unreadCount = group.notifications.filter(function(notification) {
        return notification.unread;
      }).length;
      state.unreadNotifications = angular.isDefined(lodash.find(state.groups, function(group) {
        return group.unreadCount > 0;
      }));
    }
  };

  function miqFormatNotification(text, bindings) {
    var str = __(text);
    lodash.each(bindings, function (value, key) {
      str = str.replace(new RegExp('%{' + key + '}', 'g'), value.text);
    });

    return str;
  }

  doReset();

  var cable = ActionCable.createConsumer('/ws/notifications');

  cable.subscriptions.create('NotificationChannel', {
    disconnected: function () {
      var vm = this;
      Session.requestWsToken().then(null, function () {
        logger.warning('Unable to retrieve a valid ws_token!', null, 'Notifications');
        // Disconnect permanently if the ws_token cannot be fetched
        vm.consumer.connection.close({ allowReconnect: false });
      });
    },
    received: function (data) {
      $timeout(function () {
        var msg = miqFormatNotification(data.text, data.bindings);
        service.add('event', data.level, msg, {message: msg}, data.id);
      });
    },
  });

  return service;

  function doReset() {
    var events = {
      notificationType: 'event',
      heading: 'Events',
      unreadCount: 0,
      notifications: [],
    };
    state.groups = [events];
    state.unreadNotifications = false;
    state.toastNotifications = [];

    var options = {
      expand: 'resources',
      attributes: 'details',
    };

    CollectionsApi.query('notifications', options).then(function (result) {
      result.resources.forEach(function(resource) {
        var msg = miqFormatNotification(resource.details.text, resource.details.bindings);
        events.notifications.unshift({
          id: resource.id,
          notificationType: 'event',
          unread: !resource.seen,
          type: resource.details.level,
          message: msg,
          data: {
            message: msg,
          },
          href: resource.href,
          timeStamp: resource.details.created_at,
        });
      });
      updateUnreadCount(events);
    });
  }

  function add(notificationType, type, message, notificationData, id) {
    var newNotification = {
      id: id,
      notificationType: notificationType,
      unread: true,
      type: type,
      message: message,
      data: notificationData,
      href: id ? '/api/notifications/' + id : undefined,
      timeStamp: (new Date()).getTime(),
    };

    var group = lodash.find(state.groups, {notificationType: notificationType});

    if (group) {
      if (group.notifications) {
        group.notifications.unshift(newNotification);
      } else {
        group.notifications = [newNotification];
      }
      updateUnreadCount(group);
    }
    showToast(newNotification);
  }

  function addInfo(message, notificationData, id) {
    service.add('event', 'info', message, notificationData, id);
  }

  function addSuccess(message, notificationData, id) {
    service.add('event', 'success', message, notificationData, id);
  }

  function addError(message, notificationData, id) {
    service.add('event', 'danger', message, notificationData, id);
  }

  function addWarn(message, notificationData, id) {
    service.add('event', 'warning', message, notificationData, id);
  }

  function update(notificationType, type, message, notificationData, id, showToast) {
    var notification;
    var group = lodash.find(state.groups, {notificationType: notificationType});

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
      state.groups.forEach(function(group) {
        updateUnreadCount(group);
      });
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
      var resources = group.notifications.map(function (notification) {
        notification.unread = false;
        service.removeToast(notification);

        return { href: notification.href };
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

        return { href: notification.href };
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

  function showToast(notification) {
    notification.show = true;
    notification.persistent = notification.type === 'danger' || notification.type === 'error';
    state.toastNotifications.push(notification);

    // any toast notifications with out 'danger' or 'error' status are automatically removed after a delay
    if (!notification.persistent) {
      notification.viewing = false;
      $timeout(function() {
        notification.show = false;
        if (!notification.viewing) {
          removeToast(notification);
        }
      }, toastDelay);
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
}
