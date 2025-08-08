"use client"
import { createContext, useContext, useState } from "react";
import { useAccount, useChainId } from "wagmi"
import { ethers } from "ethers"

import NftMarketJSON from '@/abis/NftMarket.json'

import { CONTRACT_ADDRESSES } from "@/config/addresses"

// 声明 window.ethereum 类型
declare global {
    interface Window {
        ethereum?: any
    }
}

const NftMarketAddress = CONTRACT_ADDRESSES.nftMarket

interface Web3ContextType {
    isConnected: boolean;
    address: string | undefined;
    chainId: number | undefined;
    NftMarketAddress: string;
    NftMarketContract: any;
    // refreshBalances: () => Promise<void>
}


interface Web3ProviderProps {
    children: React.ReactNode
}

const defaultText: Web3ContextType = {
    isConnected: false,
    address: undefined,
    chainId: undefined,
    NftMarketAddress,
    NftMarketContract: ''
    // refreshBalances: async () => { },
    // isNetworkSupported: false,
    // switchToSupportedNetwork: async () => {},
    // networkName: '',
}

const web3Context = createContext<Web3ContextType>(defaultText)


export const useWeb3 = () => {
    return useContext(web3Context)
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    let NftMarketContract;
    let singer;
    try {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
             singer = provider.getSigner();
            NftMarketContract = new ethers.Contract(NftMarketAddress, NftMarketJSON.abi, provider)
        } else {
            window.open('xxx')
        }
    } catch (error) {
        console.error("连接钱包失败")
    }



    const value = {
        address,
        isConnected,
        chainId,
        singer,
        NftMarketAddress,
        NftMarketContract,
    }
    return <web3Context.Provider value={value}>{children}</web3Context.Provider>
}


