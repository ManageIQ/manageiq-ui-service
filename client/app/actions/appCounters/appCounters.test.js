/* global test */
import actions from './'
import { APPCOUNTERS } from '../../constants/appCounters'

test('Nav has addServicesCount Redux action', () => {
  const expectedAction = {
    type: APPCOUNTERS.SERVICES_COUNT,
    count: 2
  }
  expect(actions.addServicesCount(2)).toEqual(expectedAction)
})
