/* eslint-disable sort-imports */
import ace from 'brace';
import 'brace/mode/json';

export const AceEditorComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    content: '=',
    contentType: '<?',
    readOnly: '<?',
  },
  template: '<div class="ace-editor"></div>',
};

/** @ngInject */
function ComponentController() {
  const vm = this;
  vm.$postLink = function() {
    vm.editor = loadAceEditor(vm.contentType || 'text', vm.readOnly);
    vm.editor.$blockScrolling = Infinity;
    if (vm.content) {
      vm.editor.getSession().setValue(vm.content);
    }
    vm.editor.getSession().on('change', function(_e) {
      vm.content = vm.editor.getValue();
    });
  };

  vm.$onDestroy = function() {
    vm.editor.destroy();
  };

  function loadAceEditor(mode, readonly) {
    const editor = ace.edit(angular.element.find('.ace-editor')[0]);
    editor.session.setMode('ace/mode/' + mode);
    editor.renderer.setShowPrintMargin(false);
    editor.setReadOnly(readonly);

    return editor;
  }
}
