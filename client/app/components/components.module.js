(function() {
  'use strict';

  angular.module('app.components', [
    'app.core',

    'ui.bootstrap',
    'patternfly',
    'ngSVGAttributes',
    'dndLists'
  ]);

  angular.module('patternfly.modals').controller('ModalCtrl', function ($scope) {
    $scope.additionalInfo = "Donec consequat dignissim neque, sed suscipit quam egestas in. Fusce bibendum " +
      "laoreet lectus commodo interdum. Vestibulum odio ipsum, tristique et ante vel, iaculis placerat nulla. " +
      "Suspendisse iaculis urna feugiat lorem semper, ut iaculis risus tempus.";
    $scope.copyright = "Trademark and Copyright Information";
    $scope.imgAlt = "Patternfly Symbol";
    $scope.imgSrc = "images/login-screen-logo.png";
    $scope.title = "Product Title";
    $scope.productInfo = [
      { name: 'Version', value: '1.0.0.0.20160819142038_51be77c' },
      { name: 'Server Name', value: 'Localhost' },
      { name: 'User Name', value: 'admin' },
      { name: 'User Role', value: 'Administrator' }];
    $scope.open = function () {
      $scope.isOpen = true;
    }
    $scope.onClose = function() {
      $scope.isOpen = false;
    }
  });
})();
