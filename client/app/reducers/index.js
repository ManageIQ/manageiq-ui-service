import { combineReducers } from 'redux'
import * as Nav from './nav'

export const RootReducer = combineReducers({
  nav: Nav.NavReducer
})
