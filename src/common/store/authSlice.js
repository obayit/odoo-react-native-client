import { createSlice } from "@reduxjs/toolkit"

const initialState = { uid: null }

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setAuth: (state, action) =>  action.payload,
        logOut: () => initialState,
    },
})

export const { setAuth, logOut } = authSlice.actions

export default authSlice.reducer

export const selectAuth = (state) => state.auth
