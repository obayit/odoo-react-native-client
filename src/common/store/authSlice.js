import { createSlice } from "@reduxjs/toolkit"
import { Platform } from "react-native"

const initialState = { uid: null }
const defaultDb = 'v17dash'
const defaultUrl = 'http://192.168.1.101:8017'

const initialConfigurationState = {
  baseUrl: defaultUrl,
  database:  defaultDb,
}
const initialErrorsState = []

const initialConfigurationStateWeb = {
  baseUrl: '',
  database:  defaultDb,
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
  initialState: Platform.OS == 'web' ? initialConfigurationStateWeb : initialConfigurationState,
  reducers: {
    setConfiguration: (state, action) => action.payload,
    updateConfiguration: (state, action) => {return {...state, ...action.payload } },
  },
})

const errorsSlice = createSlice({
  name: 'errors',
  initialState: initialErrorsState,
  reducers: {
    setErrors: (state, action) => action.payload,
    addError: (state, action) => { state.push(action.payload) },
    clearErrors: () => initialErrorsState,
    flagShown(state, action) {
      const err = state.find(item => item.id === action.payload)
      if (err) {
        err.shown = true
      }
    },
  },
})

export const { setAuth, logOut } = authSlice.actions
export const { setConfiguration, updateConfiguration } = configurationSlice.actions
export const { setErrors, addError, clearErrors, flagShown } = errorsSlice.actions

export default authSlice.reducer
export const configurationReducer = configurationSlice.reducer
export const errorsReducer = errorsSlice.reducer

export const selectAuth = (state) => state.auth
export const selectConfiguration = (state) => state.configuration
export const selectErrors = (state) => state.errors

