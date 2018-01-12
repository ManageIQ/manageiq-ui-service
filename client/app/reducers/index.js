import { combineReducers } from 'redux'
import * as AppCounters from './appCounters'

export const RootReducer = combineReducers({
  appCounters: AppCounters.AppCountersReducer
})
