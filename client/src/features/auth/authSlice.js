import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: "",
    refreshToken:"",
    signed: false
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload
    },
    signingIn: state => {
      state.signed = true
    },
    signingOut: state => {
      state.signed = false
    }
  }
})

export const { signingIn, signingOut, setToken, setRefreshToken } = authSlice.actions

export default authSlice.reducer
