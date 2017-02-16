export const TagsTreeComponent = {
  bindings: {
    allowedTags: '=?',
    vmTags: '=?',
  },
  templateUrl: 'app/components/request-workflow/tags-tree.html',
  controller: tagsTreeController,
  controllerAs: 'vm',
};

/** @ngInject */
function tagsTreeController(API_BASE, lodash) {
  var vm = this;
  vm.customizedAllowedTags = lodash.cloneDeep(vm.allowedTags);
  vm.$onInit = link;

  vm.API_BASE = API_BASE;

  function link(scope, element, attrs) {
    angular.element('#tagsTree').treeview({
      collapseIcon: "fa fa-angle-down",
      data: getTreeNodes(),
      levels: 2,
      expandIcon: "fa fa-angle-right",
      nodeIcon: "fa fa-folder",
      showBorder: false,
    });
  }

  // Private functions
  function getTreeNodes() {
    lodash.forEach(vm.customizedAllowedTags, function(obj, key) {
      obj.text = obj.description + " *";
      obj.nodes = [];
      lodash.forEach(obj.children, function(child, key) {
        var id = child[0];
        child = lodash.reduce(child, function(collection, current) {
          return lodash.extend(collection, current);
        }, {});

        child.id = id;
        child.text = child.description;
        delete child.description;
        obj.nodes.push(child);
      });

      adjustVmTagMatchedNodes(obj, vm.vmTags);
    });

    lodash.remove(vm.customizedAllowedTags, function(obj) {
      return obj.markedForDeletion === true;
    });

    return vm.customizedAllowedTags;
  }

  function adjustVmTagMatchedNodes(object, vmTags) {
    var childIds = lodash.map(object.nodes, 'id');
    var commonNode = lodash.intersection(childIds, vmTags);

    if (commonNode.length === 0) {
      object.markedForDeletion = true;
    } else {
      object.nodes = [lodash.find(object.nodes, {id: commonNode[0]})];
    }
  }

  function onNodeExpanded(event, node) {
    if (node.nodes) {
      var nodeToExpand = onlyOneExpandableChild(node.nodes);
      if (nodeToExpand) {
        angular.element('#tagsTree').treeview('expandNode', [nodeToExpand]);
      }
    }
  }

  function onlyOneExpandableChild(nodes) {
    var expandableNodeCount = 0;
    var lastExpandableNode;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodes) {
        expandableNodeCount++;
        lastExpandableNode = node;
      }
    }

    if (expandableNodeCount === 1) {
      return lastExpandableNode;
    } else {
      return null;
    }
  }
}

