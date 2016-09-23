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
  function ModalController(ServerInfo) {
    var vm = this;
    vm.additionalInfo = "";
    vm.copyright = __("Copyright (c) 2016 ManageIQ. Sponsored by Red Hat Inc.");
    vm.imgAlt = __("ManageIQ logo");
    vm.imgSrc = "images/login-screen-logo.png";
    vm.title = _("ManageIQ UI Self Service");
    ServerInfo.promise.then( function() {
      vm.productInfo = [
        { name: _('Version: '), value: ServerInfo.data.version },
        { name: _('Server Name: '), value: ServerInfo.data.server },
        { name: _('User Name: '), value: ServerInfo.data.user },
        { name: _('User Role: '), value: ServerInfo.data.role },
      ];
    });
    this.open = function() {
      vm.isOpen = true;
    };
    this.onClose = function() {
      vm.isOpen = false;
    };
  }
})();
