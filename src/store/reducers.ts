import { combineReducers } from 'redux'
import { reducer as profileReducer } from './slices/profile'
import { reducer as authReducer } from './slices/auth'
import { reducer as notificationReducer } from './slices/notification'
import { reducer as uiReducer } from './slices/ui'

export const rootReducer = combineReducers({
  profile: profileReducer,
  auth: authReducer,
  notification: notificationReducer,
  ui: uiReducer
})