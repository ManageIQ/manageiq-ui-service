import { combineReducers } from 'redux'
import { NavReducer } from './nav.reducer'
import { TodosReducer } from './test.reducer'
import { TokenReducer } from './token.reducer'
import { RBACReducer } from './rbac.reducer'
import { UserReducer } from './user.reducer'

export const RootReducer = combineReducers({
  nav: NavReducer,
  todos: TodosReducer,
  token: TokenReducer,
  rbac: RBACReducer,
  user: UserReducer
})
