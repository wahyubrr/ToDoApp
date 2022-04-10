import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: "",
    signed: false
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    signingIn: state => {
      state.signed = true
    },
    signingOut: state => {
      state.signed = false
    }
  }
})

export const { signingIn, signingOut, setToken } = authSlice.actions

export default authSlice.reducer
