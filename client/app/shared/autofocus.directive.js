/*
A few browsers still in use today do not fully support HTML5s 'autofocus'.

This directive is redundant for browsers that do but has no negative effects.
*/

/** @ngInject */
export function AutofocusDirective($timeout) {
  var directive = {
    restrict: 'A',
    link: link,
  };

  return directive;

  function link(_scope, element) {
    $timeout(setFocus, 1);

    function setFocus() {
      element[0].focus();
    }
  }
}
