import { APPCOUNTERS } from '../../constants/appCounters'
import Immutable from 'seamless-immutable'
const initialState = Immutable({
  SERVICES_COUNT: 0,
  CATALOGS_COUNT: 0,
  ORDERS_COUNT: 0
})

export function AppCountersReducer (state = initialState, action) {
  switch (action.type) {
    case APPCOUNTERS.SERVICES_COUNT:
    case APPCOUNTERS.CATALOGS_COUNT:
    case APPCOUNTERS.ORDERS_COUNT:
      return state.set(action.type, action.count)
    default:
      return state
  }
}
