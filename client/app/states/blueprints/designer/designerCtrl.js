angular.module('app.states').controller('designerCtrl', ['$scope', '$timeout', 'BlueprintsState', 'BlueprintDetailsModal', 'SaveBlueprintModal', '$rootScope', '$state',
  'Notifications',
    function($scope, $timeout, BlueprintsState, BlueprintDetailsModal, SaveBlueprintModal, $rootScope, $state, Notifications) {

      // dev level debug output
      var debug = false;

      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if(fromState.name === "blueprints.designer" && toState.name !== "blueprints.designer") {
          if (debug) {
            console.log("Changing from blueprints design state");
            console.log("    defaultPrevented = : " + event.defaultPrevented);
            console.log("    fromState.okToNavAway = " + fromState.okToNavAway);
          }
          var origBlueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
          if (debug) { console.log("    angular.equals(origBlueprint, $scope.blueprint: " + angular.equals(origBlueprint, $scope.blueprint)); }
          if(!angular.equals(origBlueprint, $scope.blueprint) && !event.defaultPrevented && !fromState.okToNavAway){
            if (debug) { console.log("  ---> Somethings changed, stopping progression to handle it") };
            SaveBlueprintModal.showModal($scope.blueprint, toState, toParams, fromState, fromParams);
            event.preventDefault();
          }
        }
      });

      $scope.blueprint = {};
      var blueprintDirty = false;

      var blueprintId = $scope.$parent.vm.blueprintId;
      if (blueprintId) {
          $scope.blueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
          if (!$scope.blueprint) {
            console.log("Error getting blueprint " + blueprintId);
          }
      }

      $scope.$watch("blueprint", function (oldValue, newValue) {

        if (debug) { console.log("blueprint change event captured") }

        if(!angular.equals(oldValue,newValue,true)) {
          blueprintDirty = true;
          $state.current.okToNavAway = false;
          if (debug) { console.log("blueprint is dirty"); }
        } else {
          if (debug) { console.log("blueprint is NOT dirty"); }
        }
      }, true);

      $scope.$on('BlueprintCanvasChanged', function(evt, args) {
        if (args.chartDataModel && !angular.equals($scope.blueprint.chartDataModel, args.chartDataMode)) {
          $scope.blueprint.chartDataModel = args.chartDataModel;
          blueprintDirty = true;
          if (debug) { console.log("blueprint.chartDataModel updated"); }
        }
      });

      $scope.blueprintUnchanged = function() {
        return !blueprintDirty;
      };

      $scope.saveBlueprint = function() {

        BlueprintsState.saveBlueprint($scope.blueprint);

        // get another copy to work, different obj from what was saved
        $scope.blueprint = angular.copy($scope.blueprint);

        $timeout(function() {
          blueprintDirty = false;
          $state.current.okToNavAway = false;
          if (debug) { console.log("saving blueprint - $state.current: " + angular.toJson($state.current,true)); }
        });
      };

      $scope.deleteBlueprint = function(){
        BlueprintsState.deleteBlueprint($scope.blueprint.id);
        Notifications.success($scope.blueprint.name + __(' was deleted.'));
        $state.go('blueprints.list');
      };

      $scope.editDetails = function() {
        BlueprintDetailsModal.showModal('edit', $scope.blueprint);
      };

      /*  Catalog Editor Toolbox Methods */

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
            { preTitle: 'Compute', title: 'Cloud', subtabs: [
                {title: 'AWS', items: [
                    {title: 'Amazon Operations', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Create - Elastic Load Balancer', image: 'assets/images/miq-icons/aws-elb.jpg'},
                    {title: 'Create - RDS Instance', image: 'assets/images/miq-icons/aws-rds.jpg'},
                    {title: 'Create - S3 Bucket', image: 'assets/images/miq-icons/aws-s3bucket.jpg'},
                    {title: 'Create - Virtual Private Cloud', image: 'assets/images/miq-icons/aws-vpc.jpg'},
                    {title: 'RedHat - PaaS', image: 'assets/images/miq-icons/RH-ShadowMan.jpg'},
                    {title: 'OpenShift All-In-One', image: 'assets/images/miq-icons/OpenShift.png'},
                    {title: 'OpenShift HA', image: 'assets/images/miq-icons/OpenShift-ha.jpg'}]},
                {title: 'Azure', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]},
                {title: 'GCE', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]},
                {title: 'OpenStack', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]}
            ]
            },
            { preTitle: 'Compute', title: 'Containers', subtabs: [
                {title: 'AP', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]},
                {title: 'Kubernetes', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]},
                {title: 'OSE', items: [
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/miq-icons/catalogItem.png'}]}
            ]
            },
            { preTitle: 'Compute', title: 'Infrastructure', subtabs:
              [
                {title: 'OpenStack'},
                {title: 'RHEV'},
                {title: 'SCVMM'},
                {title: 'VMware'}
              ]
            },
            { title: 'Storage', subtabs:
              [
                {title: 'NetApp'},
                {title: 'USM'}
              ]
            },
            { title: 'Network', subtabs:
              [
                {title: 'Azure Stacks'},
                {title: 'CloudFormation'},
                {title: 'Heat Templates'}
              ]
            },
            { title: 'Orchestration', subtabs:
                [
                    {title: 'Ansible'},
                    {title: 'Satellite'}
                ]
            },
            { title: 'Middleware', subtabs:
                [
                    {title: 'Hawkular'}
                ]
            },
            { title: 'Bundles', items: [
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'},
                {title: 'Bundle', image: 'assets/images/miq-icons/catalogItem.png'}]
            }
        ];

      $scope.newItem = {title: 'New Item', image: 'assets/images/miq-icons/catalogItem.png'};
    }]);
