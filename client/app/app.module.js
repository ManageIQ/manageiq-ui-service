import 'es6-shim';
import 'angular';
import 'angular-gettext';
import 'ngprogress/build/ngprogress.min.js';
import 'ngprogress/ngProgress.css';

class AppController {
  constructor($scope, ngProgressFactory) {
    'ngInject';

    this.progressbar = ngProgressFactory.createInstance();
    this.progressbar.setColor('#0088ce');
    this.progressbar.setHeight('3px');

    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
      if (toState.resolve) {
        this.progressbar.start();
      }
    });

    this.$scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      if (toState.resolve) {
        this.progressbar.complete();
      }
    });
  }

  keyDown(evt) {
    this.$scope.$broadcast('bodyKeyDown', {origEvent: evt});
  }

  keyUp(evt) {
    this.$scope.$broadcast('bodyKeyUp', {origEvent: evt});
  }
}

angular.module('app', [
  'gettext',
  'ngProgress',

  'app.core',
  'app.config',
  'app.states',
]).controller('AppController', AppController);
