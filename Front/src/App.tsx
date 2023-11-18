import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import { Home } from './pages/home/Home.page'
import { AllEvents } from './pages/events/AllEvents.page'
import { CheckSpecificEvent } from './pages/events/[id]/CheckSpecificEvent.page'
import { ManageEvents } from './pages/dashboard/events/ManageEvents.page'
import { ManageSpecificEvent } from './pages/dashboard/events/[id]/ManageSpecificEvent.page'
import { CreateEvent } from './pages/dashboard/events/create/CreateEvent.page'
import { MyTickets } from './pages/tickets/MyTickets.page'
import { Navbar } from './components/global/navbar/Navbar.component'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'viem/chains'
import { buildClient, uploadTest } from './lib/IPFS/ipfs_client'
import { Client } from '@web3-storage/w3up-client'
import { useState, useEffect } from 'react'
import { IpfsClientContext } from './Contexts/ipfsClientContext'

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })


function App() {
  const [ipfsClient, setIpfsClient] = useState<Client | null>(null)


  useEffect(() => {
    buildClient().then((client) => {
      setIpfsClient(client)
    })
    
  }, [])

  return (
    <>
    <WagmiConfig config={wagmiConfig}>
      <IpfsClientContext.Provider value={ipfsClient}>
        <BrowserRouter basename="/">
          <section id="layout">
            <Navbar />
            <button onClick={uploadTest}>Test</button>
            <Routes >
              <Route path="/"                 element={ <Home /> } />
              <Route path="/events"           element={ <AllEvents /> } />
              <Route path="/events/:id"       element={ <CheckSpecificEvent /> } />
              <Route path="/my-tickets"       element={ <MyTickets /> } />
              <Route path="/dashboard"        element={ <ManageEvents /> } />
              <Route path="/dashboard/create" element={ <CreateEvent /> } />
              <Route path="/dashboard/:id"    element={ <ManageSpecificEvent /> } />
            </Routes>
          </section>
        </BrowserRouter>
      </IpfsClientContext.Provider>
    </WagmiConfig>

    </>
  )
}

export default App
