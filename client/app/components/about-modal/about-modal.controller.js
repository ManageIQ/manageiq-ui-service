(function() {
  'use strict';
    
  angular.module('app.components')
    .directive('aboutModal', function() {
      return {
        templateUrl: "app/components/about-modal/about-modal.html",
        controller: ModalController,
        controllerAs: "vm",
      };
    });
  /** @ngInject */
  function ModalController(ServerInfo, Text) {
    var vm = this;
    vm.additionalInfo = "";
    vm.copyright = __("Copyright (c) 2016 ManageIQ. Sponsored by Red Hat Inc.");
    vm.imgAlt = __("Product logo");
    vm.imgSrc = "images/login-screen-logo.png";
    vm.title = Text.app.name;
    ServerInfo.promise.then( function() {
      vm.productInfo = [
        { name: __('Version: '), value: ServerInfo.data.version },
        { name: __('Server Name: '), value: ServerInfo.data.server },
        { name: __('User Name: '), value: ServerInfo.data.user },
        { name: __('User Role: '), value: ServerInfo.data.role },
      ];
    });
    vm.open = function() {
      vm.isOpen = true;
    };
    vm.onClose = function() {
      vm.isOpen = false;
    };
    
    return vm;
  }
})();
