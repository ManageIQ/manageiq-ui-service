/** @ngInject */
export function substitute($interpolate) {
  return function(text, context) {
    text = text.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
    var interpolateFn = $interpolate(text);

    return interpolateFn(context);
  };
}
