import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFormField, toggleTopping, postOrder, clearPostError } from '../state/pizzaSlice'

const toppings = [
  { id: '1', name: 'Pepperoni' },
  { id: '2', name: 'Green Peppers' },
  { id: '3', name: 'Pineapple' },
  { id: '4', name: 'Mushrooms' },
  { id: '5', name: 'Ham' }
]

export default function PizzaForm() {
  const dispatch = useDispatch()
  const { form, isPosting, postError } = useSelector(state => state.pizza)

  useEffect(() => {
    if (postError) {
      const timer = setTimeout(() => {
        dispatch(clearPostError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [postError, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted with:', form)
    const orderData = {
      fullName: form.fullName,
      size: form.size,
      toppings: form.toppings
    }
    console.log('Sending order data:', orderData)
    dispatch(postOrder(orderData))
  }

  const handleInputChange = (field, value) => {
    dispatch(setFormField({ field, value }))
  }

  const handleToppingToggle = (toppingId) => {
    dispatch(toggleTopping(toppingId))
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Pizza Form</h2>
      
      {isPosting && <div>Order in progress</div>}
      {postError && <div>{postError}</div>}

      <div>
        <label htmlFor="fullNameInput">Customer Name:</label>
        <input
          data-testid="fullNameInput"
          id="fullNameInput"
          name="fullName"
          placeholder="Type full name"
          type="text"
          value={form.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="sizeSelect">Size:</label>
        <select
          data-testid="sizeSelect"
          id="sizeSelect"
          name="size"
          value={form.size}
          onChange={(e) => handleInputChange('size', e.target.value)}
        >
          <option value="">----Choose size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>

      <div>
        <p>Toppings:</p>
        {toppings.map(topping => (
          <label key={topping.id}>
            <input
              data-testid={`check${topping.name.replace(' ', '').toLocaleLowerCase()}`}
              name={topping.name.toLowerCase().replace(' ', '')}
              type="checkbox"
              checked={form.toppings.includes(topping.id)}
              onChange={() => handleToppingToggle(topping.id)}
            />
            {topping.name}
          </label>
        ))}
      </div>

      <input data-testid="submit" type="submit" />
    </form>
  )
}