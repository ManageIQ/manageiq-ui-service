import { fromJS } from 'immutable'
let initialState = fromJS({})

export function NavReducer (state = initialState, action) {
  switch (action.type) {
    case 'ADD_NAV':
      return state.set('nav', action.payload)
    default:
      return state
  }
}
