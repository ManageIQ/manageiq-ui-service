/* global test */
import actions from './'
import { NAV } from '../../constants/nav'

test('Nav has add Redux action', () => {
  const expectedAction = {
    type: NAV.ADD_COUNT,
    itemType: 'services',
    count: 2
  }
  expect(actions.addCount('services', 2)).toEqual(expectedAction)
})
