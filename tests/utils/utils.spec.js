
function eventFire(el, etype){
  if (angular.isFunction(el.trigger)) {
    el.trigger(etype);
  } else if (angular.isFunction(el.fireEvent)) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

