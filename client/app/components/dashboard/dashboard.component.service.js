/** @ngInject */
export function DashboardComponentFactory (CollectionsApi) {
  return {
    allServices: resolveServices,
    allRequests: resolveRequests
  }

  function resolveRequests () {
    return [
      pendingRequestsForServiceTemplateProvisionRequest(),
      pendingRequestsForServiceReconfigureRequest(),
      approvedRequestsForServiceTemplateProvisionRequest(),
      approvedRequestsForServiceReconfigureRequest(),
      deniedRequestsForServiceTemplateProvisionRequest(),
      deniedRequestsForServiceReconfigureRequest()
    ]
  }

  function resolveServices () {
    return [
      resolveServicesWithDefinedServiceIds(),
      resolveRetiredServices(),
      resolveExpiringServices()
    ]
  }

  function pendingRequestsForServiceTemplateProvisionRequest () {
    const filterValues = ['approval_state=pending_approval']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function pendingRequestsForServiceReconfigureRequest () {
    const filterValues = ['type=ServiceReconfigureRequest', 'approval_state=pending_approval']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function approvedRequestsForServiceTemplateProvisionRequest () {
    const filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=approved']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function approvedRequestsForServiceReconfigureRequest () {
    const filterValues = ['type=ServiceReconfigureRequest', 'approval_state=approved']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function deniedRequestsForServiceTemplateProvisionRequest () {
    const filterValues = ['type=ServiceTemplateProvisionRequest', 'approval_state=denied']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function deniedRequestsForServiceReconfigureRequest () {
    const filterValues = ['type=ServiceReconfigureRequest', 'approval_state=denied']
    const options = {hide: 'resources', filter: filterValues}

    return CollectionsApi.query('requests', options)
  }

  function resolveExpiringServices () {
    const currentDate = new Date()
    const date1 = 'retires_on>' + currentDate.toISOString()
    const days30 = currentDate.setDate(currentDate.getDate() + 30)
    const date2 = 'retires_on<' + new Date(days30).toISOString()
    const options = {hide: 'resources', filter: ['retired=false', date1, date2, 'visible=true']}

    return CollectionsApi.query('services', options)
  }

  function resolveRetiredServices () {
    const options = {hide: 'resources', filter: ['service_id=nil', 'retired=true', 'visible=true']}

    return CollectionsApi.query('services', options)
  }

  function resolveServicesWithDefinedServiceIds () {
    const options = {
      expand: 'resources',
      filter: ['service_id=nil', 'visible=true'],
      attributes: ['chargeback_report']
    }

    return CollectionsApi.query('services', options)
  }
}
