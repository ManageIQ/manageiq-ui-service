/** @ngInject */
/* eslint-disable sort-imports */
import ace from 'brace';
import 'brace/mode/text';
import 'brace/theme/monokai';

export const AceEditorComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    content: "=",
  },
  template: '<div class="ace-editor"></div>',
};

/** @ngInject */
function ComponentController() {
  var vm = this;
  vm.$postLink = function () {
    vm.editor = loadAceEditor('text');
    vm.editor.$blockScrolling = Infinity;
    if (vm.content) {
      vm.editor.getSession().setValue(vm.content);
    }
    vm.editor.getSession().on('change', function (e) {
      vm.content = vm.editor.getValue();
    });
  };

  vm.$onDestroy = function () {
    vm.editor.destroy();
  };

  function loadAceEditor(mode) {
    var editor = ace.edit(angular.element.find('.ace-editor')[0]);
    editor.session.setMode("ace/mode/" + mode);
    editor.renderer.setShowPrintMargin(false);

    return editor;
  }
}
