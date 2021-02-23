import template from './404.html';

/** @ngInject */
export function NotFoundState (routerHelper) {
  var otherwise = '/404'
  routerHelper.configureStates(getStates(), otherwise)
}

function getStates () {
  return {
    '404': {
      parent: 'blank',
      url: '/404',
      template,
      title: '404',
      data: {
        layout: 'blank'
      }
    }
  }
}
