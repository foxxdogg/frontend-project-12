import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import channelsReducer from './channelsSlice'
import messagesReducer from './messagesSlice'

const loggerMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action)
  console.groupCollapsed('Redux Action:', action.type)
  console.log('Payload:', action.payload)
  console.log('New State:', storeAPI.getState())
  console.groupEnd()
  return result
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
})
