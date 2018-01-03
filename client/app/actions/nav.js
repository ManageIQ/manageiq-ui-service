import { NAV } from '../constants/nav'

export const addCount = function (itemType, count) {
  return {
    type: NAV.ADD_COUNT,
    itemType: itemType,
    count: count
  }
}
export default { addCount }
