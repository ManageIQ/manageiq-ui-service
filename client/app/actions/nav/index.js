import { NAV } from '../../constants/nav'

export const addCount = (itemType, count) => ({
  type: NAV.ADD_COUNT,
  itemType: itemType,
  count: count
})
export default { addCount }
