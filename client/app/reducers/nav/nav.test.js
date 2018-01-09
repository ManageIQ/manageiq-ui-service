/* global test */
import { NavReducer } from './'
import { NAV } from '../../constants/nav'

test('Nav Reducer should return initial state', () => {
  const expectedState = {
    'catalogs': 0,
    'orders': 0,
    'services': 0
  }
  expect(NavReducer(undefined, {})).toEqual(expectedState)
})
test('Nav Reducer should handle the ADD_COUNT method', () => {
  const action = {
    type: NAV.ADD_COUNT,
    itemType: 'services',
    count: 2
  }
  const expectedState = {
    'catalogs': 0,
    'orders': 0,
    'services': 2
  }
  expect(NavReducer(undefined, action)).toEqual(expectedState)
})
