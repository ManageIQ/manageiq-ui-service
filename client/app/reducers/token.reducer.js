import { fromJS } from 'immutable'
let initialState = fromJS({})

export function TokenReducer (state = initialState, action) {
  switch (action.type) {
    case 'ADD_TOKEN':
      return state.set('token', action.payload)
    default:
      return state
  }
}
