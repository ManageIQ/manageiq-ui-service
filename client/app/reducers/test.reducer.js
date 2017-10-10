import { TODOS } from '../constants/todos'
import Immutable from 'immutable'

let initialState = Immutable.Map([])

export function TodosReducer (state = initialState, action) {
  switch (action.type) {
    case TODOS.ADD_TODO:
      console.log('running add todo')
      console.log(state)
      // state = state.set('activeLocationId', action.id);
      return [...state, action.payload]
    default:
      return state
  }
}
