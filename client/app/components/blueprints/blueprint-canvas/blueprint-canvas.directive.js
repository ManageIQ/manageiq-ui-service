/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
      .directive('blueprintCanvas', function() {
        return {
          restrict: 'AE',
          templateUrl: "app/components/blueprints/blueprint-canvas/blueprint-canvas.html",
          scope: {
            dropCallback: '=',
            inConnectingMode: "=",
            chartViewModel: "="
          },
          controller: BlueprintCanvasController,
          controllerAs: 'vm',
          bindToController: true,
        };
      });

  /** @ngInject */
  function BlueprintCanvasController($scope, $log) {
    var vm = this;

    vm.dropCallbackfmDir = function(event, ui) {
      vm.dropCallback(event, ui);
    };
  }
})();
