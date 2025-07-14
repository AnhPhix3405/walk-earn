'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'

// 1. Get projectId from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo_project_id'

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set. Using demo project ID.')
}

// 2. Set up the Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, arbitrum, base],
  projectId
})

// 3. Configure the metadata
const metadata = {
  name: 'WalkEarn',
  description: 'Earn crypto by walking - Multi-chain fitness rewards app',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['/favicon.ico']
}

// 4. Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, polygon, arbitrum, base],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true
  }
})

function ContextProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default function AppKitProvider({ children }: { children: ReactNode }) {
  return <ContextProvider>{children}</ContextProvider>
}
