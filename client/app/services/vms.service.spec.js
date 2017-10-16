describe('VMS Service', () => {
      let service;
      const filters = [
          {'id':'name', 'value':'test'},
          {'id':'test', 'value':'test'}
      ];
      const sort = {'id':'name','sortType':'alpha'};
      const permissions = readJSON('tests/mock/rbac/allPermissions.json');

      beforeEach(module('app.services','app.shared'));
      beforeEach( () => {
          bard.inject('VmsService', 'CollectionsApi', 'RBAC');
          service = VmsService;
          RBAC.set(permissions);
          service.permissions = service.getPermissions();
      });
    it('should allow sorting to be set', () => {
        service.setSort(sort,true);
        const sortObject = service.getSort();
        const expectedSortObject = {'isAscending': true, 'currentField': sort};
        expect(sortObject).to.eql(expectedSortObject);
    });
    it('should allow for filters to be set', () => {
       service.setFilters(filters);
       const vmFilters = service.getFilters();
       expect(vmFilters.length).to.eq(2);
    });
    it('should allow for a vm to be retrieved', () => {
        const vmSpy = sinon.stub(CollectionsApi,'get').returns(Promise.resolve());
        const attributes = ['availability_zone', 'cloud_networks', 'cloud_subnets', 'cloud_tenant', 'cloud_volumes', 'flavor', 'floating_ip_addresses', 'key_pairs', 'load_balancers', 'mac_addresses', 'network_ports', 'network_routers', 'miq_provision_template', 'orchestration_stack', 'security_groups'];
        return service.getInstance('12345').then((data)=>{
            expect(vmSpy).to.have.been.calledWith('instances', '12345', {attributes: attributes});
        });
    });
    it('should be able to revert a snapshot', () => {
        const snapshotSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve());
        return service.revertSnapshot('12345', '6789').then((data) => {
            expect(snapshotSpy).to.have.been.calledWith('vms/12345/snapshots/6789', null, {}, {'action':'revert'});
        })
    });
    it('should be able to check permissions', () => {
        RBAC.set(permissions);
        const expectedPermissions = {"start":false,"stop":true,"suspend":true,"tags":true,"snapshotsView":true,"snapshotsAdd":true,"snapshotsDelete":true,"deleteAll":true,"revert":true,"retire":true}        
        expect(service.getPermissions()).to.deep.equal(expectedPermissions);
    });
    it('should allow the lifecycle dropdown to be built', () => {
        const testFN = function() {}
        const menu = service.getLifeCycleCustomDropdown(testFN, 'Test VM');
        expect(menu).to.have.all.keys('title', 'actionName', 'icon', 'actions','isDisabled', 'tooltipText');
    });
    it('should be able to get snapshots', () => {
        const snapshotSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve());
        service.setFilters(filters);
        service.setSort(sort, true);
        const snapshotOptions = {
            attributes: [],
            expand: ['resources'],
            filter: ["name='%test%'", 'test=test'],
            sort_by: 'name',
            sort_options: 'ignore_case',
            sort_order: 'asc'
        };
        return service.getSnapshots('12345').then((data) => {
            expect(snapshotSpy).to.have.been.calledWith('vms/12345/snapshots', snapshotOptions);
        });
    });
});
