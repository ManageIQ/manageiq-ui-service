/* global CollectionsApi, RBAC, ServicesState */
describe('Service: ServicesStateFactory', () => {
  let successResponse = {
    'status': 'success'
  }

  describe('basic service functions - ', () => {
    beforeEach(() => {
      module('app.services')
      bard.inject('ServicesState', '$http', 'CollectionsApi', 'ListConfiguration', 'RBAC')
    })

    it('should allow a service to be retrieved', (done) => {
      const serviceId = '12345'
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(successResponse))
      ServicesState.getService(serviceId, { isAutoRefresh: false, runAutomate: true })
      const expectedOptions = {
        attributes: [
          'name', 'guid', 'created_at', 'type', 'description', 'picture', 'picture.image_href', 'evm_owner.name', 'evm_owner.userid',
          'miq_group.description', 'aggregate_all_vm_memory', 'aggregate_all_vm_disk_count',
          'aggregate_all_vm_disk_space_allocated', 'aggregate_all_vm_disk_space_used', 'aggregate_all_vm_memory_on_disk', 'retired',
          'retirement_state', 'retirement_warn', 'retires_on', 'actions', 'custom_actions', 'provision_dialog', 'service_resources',
          'chargeback_report', 'service_template', 'parent_service', 'power_state', 'power_status', 'options', 'vms.ipaddresses',
          'vms.snapshots', 'vms.v_total_snapshots', 'vms.v_snapshot_newest_name', 'vms.v_snapshot_newest_timestamp',
          'vms.max_mem_usage_absolute_average_avg_over_time_period', 'vms.hardware', 'vms.hardware.aggregate_cpu_speed',
          'vms.cpu_usagemhz_rate_average_avg_over_time_period', 'generic_objects.picture',
          'generic_objects.generic_object_definition', 'vms.supported_consoles'
        ],
        expand: ['vms', 'orchestration_stacks', 'generic_objects'],
        auto_refresh: false
      }
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('services', serviceId, expectedOptions)
    })
    it('should be able to get a record count', (done) => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      ServicesState.getServicesMinimal()
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('services', {filter: ['ancestry=null', 'display=true']})
    })
    it('should be able to get service credentials', (done) => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(successResponse))
      const serviceCredential = '12345'
      ServicesState.getServiceCredential(serviceCredential)
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('authentications', serviceCredential, {})
    })
    it('should be able to get service repository', (done) => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(successResponse))
      const serviceRepository = '12345'
      ServicesState.getServiceRepository(serviceRepository)
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('configuration_script_sources', serviceRepository, {})
    })
    it('should be able to get ServiceJobsStdout', (done) => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(successResponse))
      const serviceId = '12345'
      const stackId = '4567'
      const expectedAttributes = {attributes: ['job_plays', 'stdout'], format_attributes: 'stdout=html'}
      ServicesState.getServiceJobsStdout(serviceId, stackId)
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('services/12345/orchestration_stacks', stackId, expectedAttributes)
    })
    it('should get users permissions', () => {
      const expectedPermissions = {
        'edit': false,
        'delete': false,
        'reconfigure': false,
        'setOwnership': false,
        'retire': false,
        'setRetireDate': false,
        'editTags': false,
        'viewAnsible': false,
        'serviceStart': false,
        'serviceStop': false,
        'serviceSuspend': false,
        'instanceStart': false,
        'instanceStop': false,
        'instanceSuspend': false,
        'instanceRetire': false,
        'cockpit': false,
        'html5_console': false,
        'vmrc_console': false,
        'viewSnapshots': false,
        'vm_snapshot_add': false,
        'vm_snapshot_show_list': false,
        'ems_infra_show': false,
        'ems_cluster_show': false,
        'host_show': false,
        'resource_pool_show': false,
        'storage_show_list': false,
        'instance_show': false,
        'vm_drift': false,
        'vm_check_compliance': false
      }
      const actualPermissions = ServicesState.getPermissions()
      expect(actualPermissions).to.eql(expectedPermissions)
    })

    it('should allow services to be retrieved', (done) => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      ServicesState.services.setSort({'id': 'name', 'title': 'Name', 'sortType': 'alpha'}, 'asc')
      const expectedOptions = {
        attributes: ['picture', 'picture.image_href', 'chargeback_report', 'evm_owner.userid', 'v_total_vms', 'power_state', 'all_service_children', 'tags'],
        auto_refresh: false,
        expand: 'resources',
        filter: ['ancestry=null', 'display=true'],
        limit: 5,
        offset: '0',
        sort_by: 'name',
        sort_options: 'ignore_case',
        sort_order: 'asc'
      }
      ServicesState.getServices(5, 0, false)
      done()

      expect(collectionsApiSpy).to.have.been.calledWith('services', expectedOptions)
    })
  })
  describe('Permission based functions - ', () => {
    beforeEach(() => {
      module('app.services')
      bard.inject('RBAC')
      sinon.stub(RBAC, 'has').returns(true)

      bard.inject('ServicesState', '$http', 'CollectionsApi', 'ListConfiguration')
    })
    it('should get getLifeCycleCustomDropdown', () => {
      const dropDown = ServicesState.getLifeCycleCustomDropdown({}, {})
      expect(dropDown.actions.length).to.eq(2)
    })
    it('should get getPolicyCustomDropdown', () => {
      const dropDown = ServicesState.getPolicyCustomDropdown({})
      expect(dropDown.title).to.eq('Policy')
      expect(dropDown.actions.length).to.eq(1)
    })
    it('should get getConfigurationCustomDropdown', () => {
      const dropDown = ServicesState.getConfigurationCustomDropdown({}, {}, {})
      expect(dropDown.title).to.eq('Configuration')
      expect(dropDown.actions.length).to.eq(3)
    })
  })
})
