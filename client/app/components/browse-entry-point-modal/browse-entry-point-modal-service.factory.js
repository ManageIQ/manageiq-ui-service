(function() {
  'use strict';

  angular.module('app.components')
    .factory('BrowseEntryPointModal', BrowseEntryPointFactory);

  /** @ngInject */
  function BrowseEntryPointFactory($modal) {
    var modalOpen = false;
    var modalEntryPoint = {
      showModal: showModal
    };

    return modalEntryPoint;

    function showModal(entryPointType) {
      var modalOptions = {
        templateUrl: 'app/components/browse-entry-point-modal/browse-entry-point-modal.html',
        controller: BrowseEntryPointModalController,
        controllerAs: 'vm',
        resolve: { entryPointType: resolveEntryPointType }
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveEntryPointType() {
        return entryPointType;
      }
    }
  }

  /** @ngInject */
  function BrowseEntryPointModalController(entryPointType, $state, $modalInstance) {
    var vm = this;
    vm.entryPointType = entryPointType;

    vm.saveEntryPoint = saveEntryPoint;
    vm.getTreeData = getTreeData;
    vm.onNodeExpanded = onNodeExpanded;

    if(vm.entryPointType === 'provisioning') {
      vm.entryPointTypeTitle = __('Provisioning');
    } else if(vm.entryPointType === 'reconfigure') {
      vm.entryPointTypeTitle = __('Reconfigure');
    } else if(vm.entryPointType === 'retirement') {
      vm.entryPointTypeTitle = __('Retirement');
    }

    activate();

    function activate() {
    }

    function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
          return i;
        }
      }
    }

    function saveEntryPoint() {

      saveSuccess();

      function saveSuccess() {
        var selectedNodes = $('#entryPointsTree').treeview('getSelected');
        if(selectedNodes && selectedNodes.length === 1) {
          $modalInstance.close({entryPointType: vm.entryPointType, entryPointData: selectedNodes[0].text});
        } else {
          console.log("No " + vm.entryPointTypeTitle + " Entry Point selected.");
        }
      }

      function saveFailure() {
        console.log("Failed to save " + vm.entryPointTypeTitle + " Entry Point.");
      }
    }

    function onNodeExpanded(event, node){
      if(node.nodes){
        var nodeToExpand = onlyOneExpandableChild(node.nodes);
        if(nodeToExpand) {
          $('#entryPointsTree').treeview('expandNode', [nodeToExpand.nodeId]);
        }
      }
    }

    function onlyOneExpandableChild(nodes){
      var expandableNodeCount = 0, lastExpandableNode, node, i;

      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if(node.nodes){
          expandableNodeCount++;
          lastExpandableNode = node;
        }
      }

      if(expandableNodeCount === 1){
        return lastExpandableNode
      } else {
        return null;
      }
    }

    // 'id' is for entry point id
    function getTreeData(){
      return [
        {
          text: 'Parent 1',
          id: 1,
          href: '#parent1',
          tags: ['4'],
          nodes: [
            {
              text: 'auto expand 1',
              href: '#child1',
              icon: 'fa fa-file-o',
              tags: ['2'],
              id: 2,
              nodes: [
                {
                  text: 'auto expand 2',
                  href: '#grandchild1',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 3,
                  nodes: [
                    {
                      text: 'do not auto expand 3',
                      href: '#grandchild1',
                      icon: 'fa fa-file-o',
                      tags: ['0'],
                      id: 3,
                      nodes: [
                        {
                          text: 'auto expand 4',
                          href: '#grandchild1',
                          icon: 'fa fa-file-o',
                          tags: ['0'],
                          id: 3,
                          nodes: [
                            {
                              text: 'gggrandchild 15',
                              href: '#grandchild1',
                              icon: 'fa fa-file-o',
                              tags: ['0'],
                              id: 3
                            },
                            {
                              text: 'gggrandchild 16',
                              href: '#grandchild2',
                              icon: 'fa fa-file-o',
                              tags: ['0'],
                              id: 4
                            }
                          ]
                        },
                        {
                          text: 'gggrandchild6',
                          href: '#grandchild2',
                          icon: 'fa fa-file-o',
                          tags: ['0'],
                          id: 4
                        }
                      ]
                    },
                    {
                      text: 'do not auto expand 6',
                      href: '#grandchild2',
                      icon: 'fa fa-file-o',
                      tags: ['0'],
                      id: 4,
                      nodes: [
                        {
                          text: 'gggrandchild 7',
                          href: '#grandchild1',
                          icon: 'fa fa-file-o',
                          tags: ['0'],
                          id: 3
                        },
                        {
                          text: 'gggrandchild 8',
                          href: '#grandchild2',
                          icon: 'fa fa-file-o',
                          tags: ['0'],
                          id: 4
                        }
                      ]
                    }
                  ]
                },
                {
                  text: 'Grandchild 2',
                  href: '#grandchild2',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 4
                }
              ]
            },
            {
              text: 'Child 2',
              href: '#child2',
              icon: 'fa fa-file-o',
              tags: ['0'],
              id: 5
            }
          ]
        },
        {
          text: 'Parent 2',
          href: '#parent2',
          tags: ['0'],
          id: 6,
          nodes: [
          {
            text: 'Child 1',
            href: '#child1',
            icon: 'fa fa-file-o',
            tags: ['2'],
            id: 2,
            nodes: [
              {
                text: 'Grandchild 1',
                href: '#grandchild1',
                icon: 'fa fa-file-o',
                tags: ['0'],
                id: 3,
                nodes: [
                  {
                    text: 'GGrandchild 3',
                    href: '#grandchild1',
                    icon: 'fa fa-file-o',
                    tags: ['0'],
                    id: 3
                  },
                  {
                    text: 'GGrandchild 4',
                    href: '#grandchild2',
                    icon: 'fa fa-file-o',
                    tags: ['0'],
                    id: 4
                  }
                ]
              },
              {
                text: 'Grandchild 2',
                href: '#grandchild2',
                icon: 'fa fa-file-o',
                tags: ['0'],
                id: 4
              }
            ]
          },
          {
            text: 'Child 2',
            href: '#child2',
            icon: 'fa fa-file-o',
            tags: ['0'],
            id: 5
          }
        ]
        },
        {
          text: 'Parent 3',
          href: '#parent2',
          tags: ['0'],
          id: 6,
          nodes: [
            {
              text: 'do not auto expand 8',
              href: '#child1',
              icon: 'fa fa-file-o',
              tags: ['2'],
              id: 2,
              nodes: [
                {
                  text: 'Grandchild 1',
                  href: '#grandchild1',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 3
                },
                {
                  text: 'Grandchild 2',
                  href: '#grandchild2',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 4
                }
              ]
            },
            {
              text: 'do not auto expand 9',
              href: '#child2',
              icon: 'fa fa-file-o',
              tags: ['0'],
              id: 5,
              nodes: [
                {
                  text: 'Grandchild 1',
                  href: '#grandchild1',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 3
                },
                {
                  text: 'Grandchild 2',
                  href: '#grandchild2',
                  icon: 'fa fa-file-o',
                  tags: ['0'],
                  id: 4
                }
              ]
            }
          ]
        }
      ];
    }
  }
})();
