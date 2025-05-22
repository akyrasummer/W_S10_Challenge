import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../state/store'
import PizzaForm from './PizzaForm'
import OrderList from './OrderList'

function App() {
  return (
    <Provider store={store}>
      <div>
      <PizzaForm />
      <OrderList />
    </div>
    </Provider>
  )
}

export default App