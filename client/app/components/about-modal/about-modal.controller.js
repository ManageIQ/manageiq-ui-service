(function() {
  'use strict';
    
  angular.module('app.components').controller('ModalCtrl', function (ServerInfo) {
    var controller = this;
    this.additionalInfo = "";
    this.copyright = "Copyright (c) 2016 ManageIQ. Sponsored by Red Hat Inc.";
    this.imgAlt = "ManageIQ logo";
    this.imgSrc = "images/login-screen-logo.png";
    this.title = "ManageIQ UI Self Service";
    ServerInfo.promise.then( function(){
      controller.productInfo = [
        { name: 'Version', value: ServerInfo.data.version },
        { name: 'Server Name', value: ServerInfo.data.server },
        { name: 'User Name', value: ServerInfo.data.user },
        { name: 'User Role', value: ServerInfo.data.role },
      ];
    });
    this.open = function () {
      controller.isOpen = true;
    };
    this.onClose = function() {
      controller.isOpen = false;
    };
});
})();
