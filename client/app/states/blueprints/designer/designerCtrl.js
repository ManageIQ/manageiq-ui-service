angular.module('app.states').controller('designerCtrl', ['$scope', '$timeout', 'BlueprintsState', 'BlueprintDetailsModal', '$state',
    function($scope, $timeout, BlueprintsState, BlueprintDetailsModal, $state) {
      $scope.chartDataModel = {};
      var blueprint = {};

      var blueprintId = $scope.$parent.vm.blueprintId;
      if (blueprintId) {
        if (blueprintId !== '-1') {
          blueprint = BlueprintsState.getBlueprintById(blueprintId);
          if (blueprint) {
            $scope.blueprintName = blueprint.name;
            $scope.chartDataModel = blueprint.chartDataModel;
          } else {
            console.log("Error getting blueprint " + blueprintId);
          }
        } else {
          blueprint.id = blueprintId;
          saveBlueprint();
        }
      }

      $scope.blueprintNameChange = function() {
        blueprint.name = $scope.blueprintName;
      };

      $scope.$on('BlueprintChanged', function(evt, args) {
        if (args.chartDataModel) {
          blueprint.chartDataModel = args.chartDataModel;
          saveBlueprint();
        }
      });

      function saveBlueprint() {
        blueprint.id = BlueprintsState.saveBlueprint(blueprint);
        if (!$scope.blueprintName) {
          $scope.blueprintName = "Untitled Catalog " + blueprint.id;
          blueprint.name = $scope.blueprintName;
        }
      }

      $scope.deleteBlueprint = function() {
        BlueprintsState.deleteBlueprint(blueprint.id);
        $state.go('blueprints.list');
      };

      $scope.editDetails = function() {
        $scope.detailsLoading = true;
        BlueprintDetailsModal.showModal(blueprint.id);
      }

      /*  Caatalog Editor Toolbox Methods */

      $scope.toolboxVisible = false;
      $scope.detailsLoading = false;

      $scope.toolboxVisible = false;

      $scope.showToolbox = function() {
        $scope.toolboxVisible = true;

        // add class to subtabs to apply PF style

        $timeout(function() {
          $( "#subtabs>ul" ).addClass('nav-tabs-pf');
        });
      };

      $scope.hideToolbox = function() {
        $scope.toolboxVisible = false;
      };

      $scope.$on('clickOnChart', function(evt) {
        $scope.hideToolbox();
      });

      $scope.tabs = [
          { title: 'Compute', subtabs: [
              {title: 'VMWare', items: [{title: 'Amazon Operations', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'Create - Elastic Load Balancer', image: 'assets/images/miq-icons/aws-elb.jpg', nodeBackgroundColor: '#c8eb79'},
                  {title: 'Create - RDS Instance', image: 'assets/images/miq-icons/aws-rds.jpg', nodeBackgroundColor: '#9f7fc3'},
                  {title: 'Create - S3 Bucket', image: 'assets/images/miq-icons/aws-s3bucket.jpg', nodeBackgroundColor: '#7dbdc3'},
                  {title: 'Create - Virtual Private Cloud', image: 'assets/images/miq-icons/aws-vpc.jpg', nodeBackgroundColor: '#f7bd7f'},
                  {title: 'RedHat - PaaS', image: 'assets/images/miq-icons/RH-ShadowMan.jpg', nodeBackgroundColor: '#ec7a08'},
                  {title: 'OpenShift All-In-One', image: 'assets/images/miq-icons/OpenShift.png', nodeBackgroundColor: '#c8eb79'},
                  {title: 'OpenShift HA', image: 'assets/images/miq-icons/OpenShift-ha.jpg', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'RHEV', items:   [{title: 'OpenShift Production', image: 'assets/images/miq-icons/OpenShift-prod.jpg',
                  nodeBackgroundColor: '#f7bd7f'},
                  {title: 'RHEV Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 3', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 4', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 5', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 6', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 7', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 8', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 9', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 10', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 11', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 12', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 12', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 14', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 15', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 16', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 17', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 18', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 19', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 20', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 21', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 22', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 23', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 24', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 25', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 26', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 27', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 28', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 29', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 30', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 31', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 32', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 32', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 34', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 35', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 36', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 37', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 38', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 39', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 40', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'},
                  {title: 'RHEV Cat Item 41', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'AWS', items:    [{title: 'AWS Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'AWS Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]}
          ]
          },
          { title: 'Storage', subtabs: [
              {title: 'StorageA', items: [{title: 'StorageA Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'StorageA Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}] },
              {title: 'StorageB', items: [{title: 'StorageB Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'StorageB Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'StorageC', items: [{title: 'StorageC Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'StorageC Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]}
          ]
          },
          { title: 'Network', subtabs: [
              {title: 'NetworkA', items: [{title: 'NetworkA Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'NetworkA Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'NetworkB', items: [{title: 'NetworkB Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'NetworkB Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'NetworkC', items: [{title: 'NetworkC Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'NetworkC Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]}
          ]
          },
          { title: 'Applications', subtabs: [
              {title: 'AppsA', items: [{title: 'AppsA Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'AppsA Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'AppsB', items: [{title: 'AppsB Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'AppsB Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'AppsC', items: [{title: 'AppsC Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'AppsC Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]}
          ]
          },
          { title: 'Other', subtabs: [
              {title: 'OtherA', items: [{title: 'OtherA Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'OtherA Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'OtherB', items: [{title: 'OtherB Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'OtherB Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]},
              {title: 'OtherC', items: [{title: 'OtherC Cat Item 1', image: 'assets/images/miq-icons/catalogItem.png',
                  nodeBackgroundColor: '#f9d67a'},
                  {title: 'OtherC Cat Item 2', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#f9d67a'}]}
          ]
          }
      ];

      $scope.newItem = {title: 'New Item', image: 'assets/images/miq-icons/catalogItem.png', nodeBackgroundColor: '#c8eb79'};
    }]);
