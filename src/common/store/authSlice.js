import { createSlice } from "@reduxjs/toolkit"

const initialState = { uid: null }
const initialConfigurationState = {
  baseUrl: 'http://192.168.112.179:8015',
  database: 'v15react',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => action.payload,
    logOut: () => initialState,
  },
})

const configurationSlice = createSlice({
  name: 'configuration',
  initialState: initialConfigurationState,
  reducers: {
    setConfiguration: (state, action) => action.payload,
  },
})

export const { setAuth, logOut } = authSlice.actions
export const { setConfiguration } = configurationSlice.actions

export default authSlice.reducer
export const configurationReducer = configurationSlice.reducer

export const selectAuth = (state) => state.auth
export const selectConfiguration = (state) => state.configuration

