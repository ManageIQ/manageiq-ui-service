/* global test */
import { appCountersReducer } from './'
import { APPCOUNTERS } from '../../constants/appCounters'

test('Nav Reducer should return initial state', () => {
  const expectedState = {
    'CATALOGS_COUNT': 0,
    'ORDERS_COUNT': 0,
    'SERVICES_COUNT': 0
  }
  expect(appCountersReducer(undefined, {})).toEqual(expectedState)
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
  expect(appCountersReducer(undefined, action)).toEqual(expectedState)
})
