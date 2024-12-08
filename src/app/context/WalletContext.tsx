/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { JsonRpcSigner, BrowserProvider, ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setAccount, setChainId, setWallet } from "../stores/reducers/userWallet";

declare global {
    interface Window {
        ethereum?: any;
    }
}

interface WalletContextType {
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    connectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            setProvider(provider);

            let accounts = await provider.send("eth_accounts", []);
            if (accounts.length === 0) {
                accounts = await provider.send("eth_requestAccounts", []);
            }

            const signer = await provider.getSigner();
            setSigner(signer);

            const network = await provider.getNetwork()

            if (Number(network.chainId) !== 97) {
                try {
                    const res = await provider.send("wallet_switchEthereumChain", [{ chainId: ethers.toBeHex(97) }]);
                    console.error("res switch network", res);
                    dispatch(setChainId(Number(network.chainId)));
                } catch (switchError: any) {
                    console.error("catch error switch network", switchError);
                    if (switchError.code === 4902) {
                        try {
                            await provider.send("wallet_addEthereumChain", [
                                {
                                    chainId: ethers.toBeHex(97),
                                    chainName: "BNBChain Testnet",
                                    nativeCurrency: {
                                        name: "BNB",
                                        symbol: "BNB",
                                        decimals: 18,
                                    },
                                    rpcUrls: ["https://bsc-testnet-rpc.publicnode.com"],
                                    blockExplorerUrls: ["https://testnet.bscscan.com"],
                                },
                            ]);
                            await provider.send("wallet_switchEthereumChain", [{ chainId: ethers.toBeHex(97) }]);
                        } catch (addError) {
                            console.error("addError", addError);
                        }
                    }
                }
            }
            const address = await signer.getAddress()

            const balance = await provider.getBalance(address)

            dispatch(setWallet({
                account: accounts[0],
                chainId: Number(network.chainId),
                balance: ethers.formatEther(balance),
            }))

            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', handleChainChanged)
        } else {
            console.log("MetaMask not installed");
        }
    }

    const handleAccountsChanged = (accounts: string[]) => {
        console.log('accountsChanged', accounts)
        if (Array.isArray(accounts) && accounts.length > 0) {
            dispatch(setAccount(accounts[0]))
        } else {
            dispatch(setAccount(""))
        }
    }

    const handleChainChanged = (network: number) => {
        console.log('chainChanged', network)
        dispatch(setChainId(Number(network)))
    }

    const checkConnect = async () => {
        if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            setProvider(provider);

            const accounts = await provider.send("eth_accounts", []);
            if (accounts.length > 0) {
                await connectWallet();
            }
        }
    }

    // 初始检测钱包是否已连接过
    useEffect(() => {
        if (!provider || !signer) {
            checkConnect()
        }
    }, [])

    useEffect(() => {
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, []);

    return (
        <WalletContext.Provider value={{ signer, provider, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextType => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
