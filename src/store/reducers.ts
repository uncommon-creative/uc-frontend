import { combineReducers } from 'redux'
import { reducer as profileReducer } from './slices/profile'
import { reducer as authReducer } from './slices/auth'

export const rootReducer = combineReducers({
  profile: profileReducer,
  auth: authReducer
})