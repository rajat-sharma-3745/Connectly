import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice.js'
import postSlice from './slices/postSlice.js'
import chatSlice from './slices/chatSlice.js'
import notiSlice from './slices/notiSlice.js'
import messageSlice from './slices/messageSlice.js'
const store = configureStore({
    reducer:{
      auth:authSlice,
      post:postSlice,
      chat:chatSlice,
      notification:notiSlice,
      message:messageSlice,
    }
})
export {store}