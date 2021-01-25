import { combineReducers } from 'redux'
import { reducer as profileReducer } from './slices/profile'
import { reducer as authReducer } from './slices/auth'
import { reducer as notificationReducer } from './slices/notification'
import { reducer as uiReducer } from './slices/ui'
import { reducer as sowReducer } from './slices/sow'
import { reducer as arbitratorReducer } from './slices/arbitrator'
import { reducer as chatReducer } from './slices/chat'
import { connectRouter } from 'connected-react-router'

export const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  profile: profileReducer,
  auth: authReducer,
  notification: notificationReducer,
  ui: uiReducer,
  statementOfWork: sowReducer,
  arbitrator: arbitratorReducer,
  chat: chatReducer
})