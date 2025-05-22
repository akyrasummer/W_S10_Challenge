// frontend/state/store.js
import { configureStore } from '@reduxjs/toolkit'
import pizzaReducer from './pizzaSlice' // adjust path if needed

export const resetStore = () => configureStore({
  reducer: {
    pizza: pizzaReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActionTypes: ['pizza/postOrder/pending', 'pizza/postOrder/fulfilled', 'pizza/postOrder/rejected']
    }
  })
})

export const store = resetStore()
