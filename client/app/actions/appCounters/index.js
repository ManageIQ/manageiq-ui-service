import { APPCOUNTERS } from '../../constants/appCounters'

export const addServicesCount = (count) => ({
  type: APPCOUNTERS.SERVICES_COUNT,
  count: count
})

export const addCatalogsCount = (count) => ({
  type: APPCOUNTERS.CATALOGS_COUNT,
  count: count
})

export const addOrdersCount = (count) => ({
  type: APPCOUNTERS.ORDERS_COUNT,
  count: count
})

export default { addServicesCount, addCatalogsCount, addOrdersCount }
