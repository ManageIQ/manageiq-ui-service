describe('Component: serviceExplorer', () => {
  let scope, ctrl;

  beforeEach(() => {
    module('app.core', 'app.states', 'app.services');
    bard.inject('$componentController', 'EventNotifications', 'ListView', 'ServicesState', '$state');
    ctrl = $componentController('serviceExplorer', {$scope: scope}, {});
    ctrl.$onInit();
  });

  it('is defined', () => expect(ctrl).to.be.defined);

  it('should set permissions', () => {
    const expectedPermissions = {
      edit: false,
      delete: false,
      reconfigure: false,
      setOwnership: false,
      retire: false,
      setRetireDate: false,
      editTags: false,
      viewAnsible: false,
      instanceStart: false,
      instanceStop: false,
      instanceSuspend: false,
      instanceRetire: false,
      cockpit: false,
      console: false,
      viewSnapshots: false,
      vm_snapshot_show_list: false,
      vm_snapshot_add: false,
      ems_infra_show: false,
      ems_cluster_show: false,
      host_show: false,
      resource_pool_show: false,
      storage_show_list: false,
      instance_show: false,
      vm_drift: false,
      vm_check_compliance: false,
      ops_diagnostics_server_view: false,
    };

    expect(ctrl.permissions).to.eql(expectedPermissions);
  });

  it('should allow pagination to be updated', () => {
    const limit = 40;
    const offset = 10;
    ctrl.paginationUpdate(limit, offset);

    expect(ctrl.limit).to.eq(limit);
    expect(ctrl.offset).to.eq(offset);
  });

  it('should set toolbar', () => {
    expect(ctrl.headerConfig.sortConfig.fields).to.have.lengthOf(3);
    expect(ctrl.headerConfig.sortConfig.currentField).to.eql({id: 'created_at', title: 'Created', sortType: 'numeric'});
  });

  it('should allow for sorting to be able to be updated', () => {
    const catalogSpy = sinon.spy(ServicesState.services, 'setSort');
    ctrl.headerConfig.sortConfig.onSortChange('name', true);

    expect(catalogSpy).to.have.been.called.once;
  });
});
