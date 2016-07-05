(function() {
  'use strict';

  angular.module('app.services')
  .factory('EventNotifications', EventNotificationsFactory);

  /** @ngInject */
  function EventNotificationsFactory($timeout) {
    var state = {};
    var toastDelay = 8 * 1000;

    var service = {
      add: add,
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
      }
    };

    var updateUnreadCount = function(group) {
      if (group) {
        group.unreadCount = group.notifications.filter(function(notification) {
          return notification.unread;
        }).length;
        state.unreadNotifications = state.groups.find(function(group) {
            return group.unreadCount > 0;
          }) !== undefined;
      }
    };

    doReset();

    return service;

    function doReset() {
      state.groups = [
        {
          notificationType: 'event',
          heading: "Events",
          unreadCount: 0,
          notifications: []
        }
      ];
      state.unreadNotifications = false;
      state.toastNotifications = [];
    }

    function add(notificationType, status, message, notificationData, id) {
      var newNotification = {
        id: id,
        notificationType: notificationType,
        unread: true,
        status: status,
        message: message,
        data: notificationData,
        timeStamp: (new Date()).getTime()
      };

      var group = state.groups.find(function(notificationGroup) {
        return notificationGroup.notificationType === notificationType;
      });

      if (group) {
        if (group.notifications) {
          group.notifications.splice(0, 0, newNotification);
        } else {
          group.notifications = [newNotification];
        }
        updateUnreadCount(group);
      }
      showToast(newNotification);
    }

    function update(notificationType, status, message, notificationData, id, showToast) {
      var notification;
      var group = state.groups.find(function(notificationGroup) {
        return notificationGroup.notificationType === notificationType;
      });

      if (group) {
        notification = group.notifications.find(function(notification) {
          return notification.id === id;
        });

        if (notification) {
          if (showToast) {
            notification.unread = true;
          }
          notification.status = status;
          notification.message = message;
          notification.data = notificationData;
          notification.timeStamp = (new Date()).getTime();
          updateUnreadCount(group);
        }
      }

      if (showToast) {
        if (!notification) {
          notification = {
            status: status,
            message: message
          };
        }

        showToast(notification);
      }
    }

    function markRead(notification, group) {
      if (notification) {
        notification.unread = false;
      }
      if (group) {
        updateUnreadCount(group);
      } else {
        state.groups.forEach(function(group) {
          updateUnreadCount(group);
        });
      }
    }

    function markUnread(notification, group) {
      if (notification) {
        notification.unread = true;
      }
      if (group) {
        updateUnreadCount(group);
      } else {
        state.groups.forEach(function(group) {
          updateUnreadCount(group);
        });
      }
    }

    function markAllRead(group) {
      if (group) {
        group.notifications.forEach(function(notification) {
          notification.unread = false;
        });
        group.unreadCount = 0;
      }
    }

    function markAllUnread(group) {
      if (group) {
        group.notifications.forEach(function(notification) {
          notification.unread = true;
        });
        group.unreadCount = group.notifications.length;
      }
    }

    function clear(notification, group) {
      var index;

      if (!group) {
        group = state.groups.find(function(nextGroup) {
          return notification.notificationType === nextGroup.notificationType;
        });
      }

      if (group) {
        index = group.notifications.indexOf(notification);
        if (index > -1) {
          group.notifications.splice(index, 1);
          updateUnreadCount(group);
        }
      }
    }

    function clearAll(group) {
      if (group) {
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
      notification.persistent = true;
      state.toastNotifications.push(notification);

      // any toast notifications with out 'danger' or 'error' status are automatically removed after a delay
      if (notification.status !== 'danger' && notification.status !== 'error') {
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
    }
  }
})();
