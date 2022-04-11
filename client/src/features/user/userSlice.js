import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: "",
    firstName: "",
    lastName: ""
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload
    }
  }
})

export const { setUsername, setFirstName } = userSlice.actions

export default userSlice.reducer
