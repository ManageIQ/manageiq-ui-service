import { combineReducers } from 'redux'
import * as appCounters from './appCounters'

export const RootReducer = combineReducers({
  appCounters: appCounters.appCountersReducer
})
