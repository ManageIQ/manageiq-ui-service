/* global test */
import { AppCountersReducer } from './'
import { APPCOUNTERS } from '../../constants/appCounters'

test('Nav Reducer should return initial state', () => {
  const expectedState = {
    'CATALOGS_COUNT': 0,
    'ORDERS_COUNT': 0,
    'SERVICES_COUNT': 0
  }
  expect(AppCountersReducer(undefined, {})).toEqual(expectedState)
})
test('Nav Reducer should handle the ADD_COUNT method', () => {
  const action = {
    type: APPCOUNTERS.SERVICES_COUNT,
    count: 2
  }
  const expectedState = {
    'CATALOGS_COUNT': 0,
    'ORDERS_COUNT': 0,
    'SERVICES_COUNT': 2
  }
  expect(AppCountersReducer(undefined, action)).toEqual(expectedState)
})
