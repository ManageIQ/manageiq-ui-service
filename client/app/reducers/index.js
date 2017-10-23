import { combineReducers } from 'redux'
import { TokenReducer } from './token'

export const RootReducer = combineReducers({
  token: TokenReducer
})
