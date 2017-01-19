export const LoadingComponent = {
  bindings: {
    status: '<',
  },
  template: '<div ng-if="$ctrl.status" class="drawer-pf-loading text-center">'
    + '<span class="spinner spinner-xs spinner-inline"></span> {{ "Loading More" | translate }}  </div>',
};
