(function() {
  'use strict';
    
  angular.module('app.components')
    .directive('aboutModal', function() {
      return {
        templateUrl: "app/components/about-modal/about-modal.html",
        controller: ModalCtrl,
        controllerAs: "info",
      };
    });
  /** @ngInject */
  function ModalCtrl(ServerInfo) {
    var vm = this;
    this.additionalInfo = "";
    this.copyright = "Copyright (c) 2016 ManageIQ. Sponsored by Red Hat Inc.";
    this.imgAlt = "ManageIQ logo";
    this.imgSrc = "images/login-screen-logo.png";
    this.title = "ManageIQ UI Self Service";
    ServerInfo.promise.then( function() {
      vm.productInfo = [
        { name: 'Version', value: ServerInfo.data.version },
        { name: 'Server Name', value: ServerInfo.data.server },
        { name: 'User Name', value: ServerInfo.data.user },
        { name: 'User Role', value: ServerInfo.data.role },
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
