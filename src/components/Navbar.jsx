import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">🔨 AUCTION HUB</NavLink>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/auctions">Auctions</NavLink>
        <NavLink to="/sell">Sell</NavLink>
        <NavLink to="/my-auctions">My Auctions</NavLink>
        <NavLink to="/my-bids">My Bids</NavLink>
      </div>
    </nav>
  )
}
