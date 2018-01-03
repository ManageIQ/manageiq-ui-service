import { NAV } from '../constants/nav'
import Immutable from 'seamless-immutable'
const initialState = Immutable({
  services: 0,
  orders: 0,
  catalogs: 0
})

export function NavReducer (state = initialState, action) {
  switch (action.type) {
    case NAV.ADD_COUNT:
      return state.set(action.itemType, action.count)
    default:
      return state
  }
}
