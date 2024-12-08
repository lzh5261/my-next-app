
'use client';
import { useWallet } from "@/app/context/WalletContext";
import { useCallback } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../stores";

const ConnectWallet: React.FC = () => {
    const { connectWallet, signer } = useWallet()
    const userWallet = useSelector((state: RootState) => state.userWallet)

    const showAddress = (address: string) => {
        return `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`
    }

    const handleConnectWallet = useCallback(async () => {
        console.log(signer);
        if (!signer) {
            await connectWallet()
        }
    }, [connectWallet, signer])

    return (
        <div>
            <div>ChainId: {userWallet.chainId}</div>
            <button className="bg-black px-5 py-2 text-white mr-2"
                onClick={handleConnectWallet}
            >
                {userWallet.account ? showAddress(userWallet.account) : "Connect"}
            </button>
            ETH: {userWallet.balance}
        </div>
    )
}

export default ConnectWallet