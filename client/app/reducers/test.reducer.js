import { TODOS } from '../constants/todos'
const initialState = []

export function TodosReducer (state = initialState, action) {
  switch (action.type) {
    case TODOS.ADD_TODO:
      console.log('running add todo')
      return [...state, action.payload]
    default:
      return state
  }
}
