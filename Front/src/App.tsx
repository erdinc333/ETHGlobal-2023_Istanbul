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


function App() {
  return (
    <>
    <BrowserRouter basename="/">
      <section id="layout">
        <Navbar />

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
    </>
  )
}

export default App
