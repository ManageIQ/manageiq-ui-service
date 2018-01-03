import { combineReducers } from 'redux'
import { NavReducer } from './nav'

export const RootReducer = combineReducers({
  nav: NavReducer
})
