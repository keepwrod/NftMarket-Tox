// import { WalletList } from "@rainbow-me/rainbowkit";
"use client"
import { WalletList, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { metaMaskWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";
import { http } from "viem";
import { mainnet, sepolia } from "viem/chains";

const wallets: WalletList = [
    {
        groupName: 'Wallets',
        wallets: [okxWallet, metaMaskWallet]
    }
]

const metadata = {
    name: "TOX-NftMarket",
    projectId: "1"
}

const chains = [mainnet, sepolia] as const;

const config = getDefaultConfig({
    appName: metadata.name,
    projectId: metadata.projectId,
    ssr: true,
    chains,
    transports: {
        [chains[0].id]: http(),
        [chains[1].id]: http()
    },
    wallets
})

export const WagmiConfig = config;
export const defaultNetwork = chains[1];