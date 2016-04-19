angular.module('app.states').controller('designerCtrl', ['$scope', '$timeout', 'BlueprintsState', 'BlueprintDetailsModal', '$state',
  'Notifications',
    function($scope, $timeout, BlueprintsState, BlueprintDetailsModal, $state, Notifications) {
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
          $scope.blueprintName = "Untitled Blueprint " + blueprint.id;
          blueprint.name = $scope.blueprintName;
        }
      }

      $scope.deleteBlueprint = function(){
        BlueprintsState.deleteBlueprint(blueprint.id);
        Notifications.success(blueprint.name + __(' was deleted.'));
        $state.go('blueprints.list');
      };

      $scope.editDetails = function() {
        BlueprintDetailsModal.showModal('edit', blueprint.id);
      };

      /*  Caatalog Editor Toolbox Methods */

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
