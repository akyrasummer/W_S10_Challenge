import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrderHistory, setSizeFilter } from '../state/pizzaSlice'

const toppingNames = {
  '1': 'Pepperoni',
  '2': 'Green Peppers',
  '3': 'Pineapple',
  '4': 'Mushrooms',
  '5': 'Ham'
}

export default function OrderList() {
  const dispatch = useDispatch()
  const { orders, sizeFilter, isLoading, error } = useSelector(state => state.pizza)

  useEffect(() => {
    dispatch(fetchOrderHistory())
  }, [dispatch])

  const handleFilterChange = (size) => {
    dispatch(setSizeFilter(size))
  }

  const filteredOrders = sizeFilter === 'All' 
    ? orders 
    : orders.filter(order => order.size === sizeFilter)

  const formatToppings = (toppings) => {
    if (!toppings || toppings.length === 0) return 'NO TOPPINGS'
    return toppings.map(id => toppingNames[id.toString()]).join(', ')
  }

  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Pizza Orders</h2>
      
      <div>
        <button 
          data-testid="filterBtnAll"
          onClick={() => handleFilterChange('All')}
        >
          All
        </button>
        <button 
          data-testid="filterBtnS"
          onClick={() => handleFilterChange('S')}
        >
          S
        </button>
        <button 
          data-testid="filterBtnM"
          onClick={() => handleFilterChange('M')}
        >
          M
        </button>
        <button 
          data-testid="filterBtnL"
          onClick={() => handleFilterChange('L')}
        >
          L
        </button>
      </div>

      <div>
        {filteredOrders.length === 0 ? (
          <p>No orders yet!</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id}>
              <p>
                {order.customer} ordered a size {order.size} with{' '}
                {formatToppings(order.toppings)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}