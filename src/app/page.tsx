/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import ConnectWallet from "@/app/components/ConnectWallet";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/app/stores';
import { transferToken, getTokenBalance } from "@/app/service";
import { ethers } from "ethers";
import { useWallet } from "./context/WalletContext";

export default function Home() {
    const { signer, provider } = useWallet();
    const userWallet = useSelector((state: RootState) => state.userWallet)
    const [loading, setLoading] = useState(false)
    const [hash, setHash] = useState("")
    const [recipient, setRecipient] = useState("")
    const [tokenBalance, setTokenBalance] = useState(0)
    const [amount, setAmount] = useState("")
    const onChangeRecipient = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecipient(e.target.value)
    }
    const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }
    const handleTransferToken = async () => {
        if (!ethers.isAddress(recipient)) {
            alert("输入有效地址")
            return
        }
        if (isNaN(Number(amount))) {
            alert("输入有效数量")
            return
        }
        if (Number(amount) > tokenBalance) {
            alert("余额不足")
            return
        }
        setLoading(true)
        try {
          const ret = await transferToken(signer, recipient, amount)
          console.log("[handleTransferToken]", ret);
          setHash(ret.hash)
          setRecipient("")
          setAmount("")
          handleGetTokenBalance()
        } catch (error) {
          console.log(error);
        }
        setLoading(false)
    }

    const handleGetTokenBalance = async () => {
        if (!userWallet.account) {
            return
        }
        getTokenBalance(provider, userWallet.account).then(balance => {
            console.log("[handleGetTokenBalance]", balance);
            setTokenBalance(Number(balance))
        })
    }

    useEffect(() => {
        if (provider && userWallet.account) {
            handleGetTokenBalance()
        }
    }, [provider, userWallet.account])

    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main>
                <ConnectWallet />
                <input className="border border-black px-5 py-2 text-base mt-3"
                    type="text"
                    placeholder="输入接收地址0x...."
                    value={recipient}
                    onChange={onChangeRecipient}
                />
                <br />
                <input className="border border-black px-5 py-2 text-base mt-3"
                    type="number"
                    placeholder="输入转账数量"
                    value={amount}
                    onChange={onChangeAmount}
                />
                <div>USDT: {tokenBalance}</div>
                <button className="bg-black px-5 py-2 my-3 text-white"
                    onClick={handleTransferToken}
                >
                    {loading ? "Sending..." : "Transfer"}
                </button>
                {
                  hash &&
                  <a
                      className="underline hover:underline-offset-4 text-blue-500"
                      href={`https://testnet.bscscan.com/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      查看交易详情
                  </a>
                }
            </main>
        </div>
    );
}
