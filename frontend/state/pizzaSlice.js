import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for fetching order history
export const fetchOrderHistory = createAsyncThunk(
  'pizza/fetchOrderHistory',
  async () => {
    const response = await fetch('http://localhost:9009/api/pizza/history')
    const data = await response.json()
    return data
  }
)

// Async thunk for posting a new order
export const postOrder = createAsyncThunk(
  'pizza/postOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Posting order:', orderData) // Debug log
      const response = await fetch('http://localhost:9009/api/pizza/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      console.log('Response status:', response.status) // Debug log
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('Error response:', errorData) // Debug log
        return rejectWithValue(errorData.message)
      }
      
      const data = await response.json()
      console.log('Success response:', data) // Debug log
      return data
    } catch (error) {
      console.log('Catch error:', error) // Debug log
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  orders: [],
  sizeFilter: 'All',
  isLoading: false,
  isPosting: false,
  error: null,
  postError: null,
  form: {
    fullName: '',
    size: '',
    toppings: []
  }
}

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setSizeFilter: (state, action) => {
      state.sizeFilter = action.payload
    },
    setFormField: (state, action) => {
      const { field, value } = action.payload
      state.form[field] = value
    },
    toggleTopping: (state, action) => {
      const toppingId = action.payload
      const index = state.form.toppings.indexOf(toppingId)
      if (index === -1) {
        state.form.toppings.push(toppingId)
      } else {
        state.form.toppings.splice(index, 1)
      }
    },
    resetForm: (state) => {
      state.form = {
        fullName: '',
        size: '',
        toppings: []
      }
    },
    clearPostError: (state) => {
      state.postError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch order history
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Post new order
      .addCase(postOrder.pending, (state) => {
        state.isPosting = true
        state.postError = null
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isPosting = false
        state.orders.push(action.payload)
        state.form = {
          fullName: '',
          size: '',
          toppings: []
        }
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isPosting = false
        state.postError = action.payload
      })
  }
})

export const { setSizeFilter, setFormField, toggleTopping, resetForm, clearPostError } = pizzaSlice.actions
export default pizzaSlice.reducer