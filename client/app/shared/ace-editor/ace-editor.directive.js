// global-require
/** @ngInject */
export function AceEditorDirective() {
  const directive = {
    restrict: 'AE',
    scope: {
      content: '=',
    },
    template: '<div class="ace-editor"></div>',
    controller: AceEditorController,
    controllerAs: 'vm',
    bindToController: true,
  };

  return directive;

    /** @ngInject */
  function AceEditorController($element) {
    var vm = this;
    var ace = require('brace');
    require('brace/mode/text');
    require('brace/theme/monokai');

    var editor = loadAceEditor('text');

    if (vm.content) {
      editor.getSession().setValue(vm.content);
    }

    editor.getSession().on('change', function(e) {
      vm.content = editor.getValue();
    });

    function loadAceEditor(mode) {
      var editor = ace.edit($element.find('.ace-editor')[0]);
      editor.session.setMode("ace/mode/" + mode);
      editor.renderer.setShowPrintMargin(false);

      return editor;
    }
  }
}
