import { fromJS } from 'immutable'
let initialState = fromJS({})

export function UserReducer (state = initialState, action) {
  switch (action.type) {
    case 'ADD_USER':
      return state.set('user', action.payload)
    default:
      return state
  }
}
