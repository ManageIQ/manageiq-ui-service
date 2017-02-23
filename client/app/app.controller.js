export class AppController {
  constructor($scope, ngProgressFactory) {
    'ngInject';

    this.progressbar = ngProgressFactory.createInstance();
    this.progressbar.setColor('#0088ce');
    this.progressbar.setHeight('3px');

    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.$on('$stateChangeStart', (_event, toState) => {
      if (toState.resolve) {
        this.progressbar.start();
      }
    });

    this.$scope.$on('$stateChangeSuccess', (_event, toState) => {
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
