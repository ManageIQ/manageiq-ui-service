import { combineReducers } from 'redux'
import { TodosReducer } from './test.reducer'

export const RootReducer = combineReducers({
  todos: TodosReducer
})
