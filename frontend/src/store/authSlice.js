import { createSlice } from '@reduxjs/toolkit'

let storedUser = null
try {
  storedUser = JSON.parse(localStorage.getItem('user'))
}
catch (e) {
  storedUser = null
  console.log(e)
}

const initialState = {
  token: localStorage.getItem('token') || null,
  user: storedUser,
  isLoggedIn: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      state.isLoggedIn = true
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
