(function() {
  'use strict';

  angular.module('app.components')
    .directive('customButton', CustomButtonDirective);

  /** @ngInject */
  function CustomButtonDirective($window, $timeout) {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        customActions: '=',
        actions: '=?',
        serviceId: '=',
        serviceTemplateCatalogId: '=',
      },
      link: link,
      templateUrl: 'app/components/custom-button/custom-button.html',
      controller: CustomButtonController,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      controller.activate();

      var win = angular.element($window);
      win.bind('resize', function() {
        scope.$apply();
      });

      scope.$watch(getWindowWidth, function(newWidth, oldWidth) {
        if (newWidth !== oldWidth) {
          checkRoomForButtons();
        }
      });

      // Set inital button state
      checkRoomForButtons();

      function checkRoomForButtons() {
        // Allow the buttons to render to calculate width
        controller.collapseCustomButtons = false;

        $timeout(function() {
          var outerWidth = document.querySelectorAll('.ss-details-header__actions')[0].offsetWidth;
          var innerWidth = document.querySelectorAll('.ss-details-header__actions__inner')[0].offsetWidth;
          if (innerWidth >= outerWidth) {
            // Not enough room - collapse them down
            controller.collapseCustomButtons = true;
          }
        }, 0);
      }

      function getWindowWidth() {
        return win.width();
      }
    }

    /** @ngInject */
    function CustomButtonController($state, EventNotifications, CollectionsApi) {
      var vm = this;

      vm.activate = activate;
      vm.customButtonAction = customButtonAction;
      vm.collapseCustomButtons = false;

      function activate() {
        angular.forEach(vm.actions, processActionButtons);
      }

      function processActionButtons(buttonAction) {
        var temp = buttonAction.href.split('/api/')[1];
        buttonAction.collection = temp.split('/')[0];
        buttonAction.id = temp.split('/')[1];
      }

      function customButtonAction(button, serviceId, serviceTemplateCatalogId) {
        var assignedButton = {};
        angular.forEach(vm.actions, actionButtonMapping);

        if (angular.isDefined(button.resource_action.dialog_id) && button.resource_action.dialog_id !== null) {
          $state.go('services.custom_button_details', {
            button: button,
            buttonId: button.id,
            dialogId: button.resource_action.dialog_id,
            serviceId: serviceId,
            serviceTemplateCatalogId: serviceTemplateCatalogId,
          });
        } else {
          if (assignedButton.method === 'post') {
            var data = {action: button.name};
            CollectionsApi.post(assignedButton.collection, assignedButton.id, {}, data).then(postSuccess, postFailure);
          } else if (assignedButton.method === 'delete') {
            CollectionsApi.delete(assignedButton.collection, assignedButton.id, {}).then(deleteSuccess, deleteFailure);
          } else {
            EventNotifications.error(__('Button action not supported.'));
          }
        }

        // Private functions
        function actionButtonMapping(buttonMatched) {
          if (buttonMatched.name.toLowerCase() === button.name.toLowerCase()) {
            assignedButton = buttonMatched;
          }
        }

        function postSuccess(response) {
          if (response.success === false) {
            EventNotifications.error(response.message);
          } else {
            EventNotifications.success(response.message);
          }
        }

        function postFailure() {
          EventNotifications.error(__('Action not able to submit.'));
        }

        function deleteSuccess(response) {
          if (response.success === false) {
            EventNotifications.error(response.message);
          } else {
            EventNotifications.success(response.message);
          }
        }

        function deleteFailure() {
          EventNotifications.error(__('Action not able to submit.'));
        }
      }
    }
  }
})();
