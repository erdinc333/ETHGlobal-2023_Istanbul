import './Navbar.scss'
import { Logo } from "../logo/Logo.component";
import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
    <>
      <div id="navbar">
        <div className="fixed">
          <Logo color="secondary" />

          <ul className="links">
            <NavLink to="/"           className={({ isActive }) => isActive ? 'link active' : 'link'} >Home</NavLink>
            <NavLink to="/events"     className={({ isActive }) => isActive ? 'link active' : 'link'} >Events</NavLink>
            <NavLink to="/my-tickets" className={({ isActive }) => isActive ? 'link active' : 'link'} >My Tickets</NavLink>
            <NavLink to="/dashboard"  className={({ isActive }) => isActive ? 'link active' : 'link'} >Dashboard</NavLink>
            <w3m-button />
          </ul>
        </div>
        <div className="blocked"></div>
        
      </div>
    </>
  )
}