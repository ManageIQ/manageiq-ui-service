(function() {
  'use strict';
    
  angular.module('app.components').controller('ModalCtrl', function ($scope, ServerInfo) {
    $scope.additionalInfo = "";
    $scope.copyright = "Copyright (c) 2016 ManageIQ. Sponsored by Red Hat Inc.";
    $scope.imgAlt = "ManageIQ logo";
    $scope.imgSrc = "images/login-screen-logo.png";
    $scope.title = "ManageIQ UI Self Service";
    ServerInfo.promise.then( function(){
      $scope.productInfo = [
        { name: 'Version', value: ServerInfo.data.version },
        { name: 'Server Name', value: ServerInfo.data.server },
        { name: 'User Name', value: ServerInfo.data.user },
        { name: 'User Role', value: ServerInfo.data.role },
      ];
    });
    $scope.open = function () {
      $scope.isOpen = true;
    };
    $scope.onClose = function() {
      $scope.isOpen = false;
    };
});
})();
