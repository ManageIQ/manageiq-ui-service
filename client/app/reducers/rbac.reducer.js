import { fromJS } from 'immutable'
let initialState = fromJS({})

export function RBACReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_RBAC':
      console.log(state)
      return state.set('rbac', action.payload)
    default:
      return state
  }
}
