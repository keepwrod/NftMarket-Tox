"use client"
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, defaultNetwork } from '@/app/config/index'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Web3Provider } from './contexts/Web3Context'

interface ProviderPorps {
    children: React.ReactNode
}

export default function Provider({ children }: ProviderPorps) {
    const queryClient = new QueryClient

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={WagmiConfig}>
                <RainbowKitProvider initialChain={defaultNetwork}>
                    <Web3Provider>
                        {children}
                    </Web3Provider>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>

    )
}