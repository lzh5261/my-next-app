import { AbstractProvider, BrowserProvider, ethers, JsonRpcSigner } from "ethers"
import {TOKEN_ADDR, TOKEN_ABI} from "@/app/constant"

export async function transferToken(
    signer: JsonRpcSigner | null,
    recipient: string,
    amount: string,
) {
    try {
        if (!signer) {
           return false 
        }
        const tokenContract = new ethers.Contract(TOKEN_ADDR, TOKEN_ABI, signer)
        const _amount = ethers.parseEther(amount).toString()
        console.log('[transferToken] _amount', _amount)
        const tx = await tokenContract.transfer(recipient, _amount)
        console.log('[transferToken] tx', tx)
        const receipt = await tx.wait()
        console.log('[transferToken] receipt', receipt)
        return receipt
    } catch (error) {
        console.log('[transferToken] catch', error)
        return false
    }
}

export async function getTokenBalance(
    provider: BrowserProvider | AbstractProvider | null,
    recipient: string,
) {
    try {
        if (!provider) {
           return false 
        }
        const tokenContract = new ethers.Contract(TOKEN_ADDR, TOKEN_ABI, provider)
        const balance = await tokenContract.balanceOf(recipient)
        console.log('[getTokenBalance] balance', balance)
        return ethers.formatEther(balance)
    } catch (error) {
        console.log('[getTokenBalance] catch', error)
        return 0
    }
}