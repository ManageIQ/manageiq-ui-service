angular.module('app.states').controller('canvasCtrl', ['$scope',
    function($scope) {
      var chartDataModel = {};
      if ($scope.$parent.chartDataModel) {
        chartDataModel = $scope.$parent.chartDataModel;
      }

      //
      // Create the view-model for the chart and attach to the scope.
      //
      $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

      $scope.$watch("chartViewModel.data", function(oldValue, newValue) {
        $scope.$emit('BlueprintChanged', {chartDataModel: $scope.chartViewModel.data});
      });

      $scope.startCallback = function(event, ui, item) {
        $scope.draggedItem = item;
      };

      $scope.dropCallback = function(event, ui) {
        var newNode = angular.copy($scope.draggedItem);
        newNode.id = nextNodeID++;
        newNode.name = newNode.title;
        newNode.backgroundColor = newNode.nodeBackgroundColor;
        newNode.x = event.clientX - 350;
        newNode.y = event.clientY - 200;
        $scope.addNewNode(newNode);
      };

      $scope.addNodeByClick = function(item) {
        var newNode = angular.copy(item);
        newNode.id = nextNodeID++;
        newNode.name = newNode.title;
        newNode.backgroundColor = newNode.nodeBackgroundColor;
        newNode.x = 250 + (nextNodeID * 4 + 160);
        newNode.y = 200 + (nextNodeID * 4 + 160);
        $scope.addNewNode(newNode);
      };

      $scope.addNewNode = function(newNode) {
        $scope.chartViewModel.addNode(newNode);
      };

      $scope.deleteSelected = function() {
        $scope.chartViewModel.deleteSelected();
      };

      /*
       *    FlowChart Vars and Methods
       */

      //
      // Code for the delete key.
      //
      var deleteKeyCode = 46;

      //
      // Code for control key.
      //
      var ctrlKeyCode = 17;

      //
      // Set to true when the ctrl key is down.
      //
      var ctrlDown = false;

      //
      // Code for A key.
      //
      var aKeyCode = 65;

      //
      // Code for esc key.
      //
      var escKeyCode = 27;

      //
      // Selects the next node id.
      //
      var nextNodeID = 10;

      //
      // Event handler for key-down on the flowchart.
      //
      $scope.$on('bodyKeyDown', function(evt, args) {
        if (args.origEvent.keyCode === ctrlKeyCode) {
          ctrlDown = true;
          args.origEvent.stopPropagation();
          args.origEvent.preventDefault();
        }

        if (args.origEvent.keyCode === aKeyCode && ctrlDown) {
          //
          // Ctrl + A
          //
          $scope.chartViewModel.selectAll();
          args.origEvent.stopPropagation();
          args.origEvent.preventDefault();
        }
      });

      //
      // Event handler for key-up on the flowchart.
      //

      $scope.$on('bodyKeyUp', function(evt, args) {
        if (args.origEvent.keyCode === deleteKeyCode) {
          //
          // Delete key.
          //
          $scope.chartViewModel.deleteSelected();
        }

        if (args.origEvent.keyCode === escKeyCode) {
          // Escape.
          $scope.chartViewModel.deselectAll();
        }

        if (args.origEvent.keyCode === ctrlKeyCode) {
          ctrlDown = false;
          args.origEvent.stopPropagation();
          args.origEvent.preventDefault();
        }
      });
    }]);
