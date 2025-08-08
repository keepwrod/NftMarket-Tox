"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

import { routes } from '../routes'
import { Web3Provider, useWeb3 } from "../contexts/Web3Context"
import { useContext } from "react"


interface LayoutProps {
    children: React.ReactNode
}


export default function Layout({ children }: LayoutProps) {
    const { address } = useWeb3();
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="w-full flex p-4 justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-indigo-500" >
                        <div >TOX</div>
                    </h1>
                    <ul className="flex flex-row">
                        {
                            routes?.map((route: { label: string, path: string }) => {
                                return <li className="mx-2" key={route.path}>
                                    <Link href={route.path} className="px-4 py-2 rounded hover:bg-indigo-100 transition">{route.label}</Link>
                                </li>
                            })
                        }
                    </ul>
                </div>
                
                    {
                        address && <Link href='/create' className="px-4 py-2 rounded hover:bg-indigo-100 transition">create</Link>
                    }
                <ConnectButton />
            </header>
            <div>
                {children}
            </div>
        </div>)
}