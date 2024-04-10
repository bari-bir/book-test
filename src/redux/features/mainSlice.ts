import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AxiosError } from "axios"

interface IState {
    isLoading: boolean
    error: AxiosError | null
    userInfo: { [key: string]: unknown }
}

const initialState: IState = {
    isLoading: false,
    error: null,
    userInfo: {},
}

export const mainSlice = createSlice({
    name: "mainSlice",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
        setError(state, action: PayloadAction<AxiosError | null>) {
            state.error = action.payload
        },
    },
})

export const { setLoading, setError } = mainSlice.actions

export default mainSlice.reducer
