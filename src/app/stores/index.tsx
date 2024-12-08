import { configureStore } from "@reduxjs/toolkit";
import userWallet from "@/app/stores/reducers/userWallet";

const store = configureStore({
    reducer: {
        userWallet: userWallet,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppState = typeof store.dispatch

export default store