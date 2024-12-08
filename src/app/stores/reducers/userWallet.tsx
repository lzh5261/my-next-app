import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserWallet = {
    account: "",
    balance: "0",
    chainId: 56
}

const walletSlice = createSlice({
    name: "userWallet",
    initialState,
    reducers: {
        setWallet: (state, action: PayloadAction<UserWallet>) => {
            if (action.payload.account) {
                state.account = action.payload.account
            }
            if (state.chainId) {
                state.chainId = action.payload.chainId
            }
            if (state.balance) {
                state.balance = action.payload.balance
            }
        },
        exitTwaWallet: (state) => {
            state.account = initialState.account
            state.chainId = initialState.chainId
            state.balance = initialState.balance
        },
        setChainId: (state, action: PayloadAction<number>) => {
            state.chainId = action.payload
        },
        setAccount: (state, action: PayloadAction<string>) => {
            state.account = action.payload
        },
    }
})

export const { setWallet, exitTwaWallet, setChainId, setAccount } = walletSlice.actions

export default walletSlice.reducer