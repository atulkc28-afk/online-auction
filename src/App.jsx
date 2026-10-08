import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auctions from './pages/Auctions'
import AuctionDetails from './pages/AuctionDetails'
import CreateAuction from './pages/CreateAuction'
import MyAuctions from './pages/MyAuctions'
import MyBids from './pages/MyBids'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auctions/:id" element={<AuctionDetails />} />
          <Route path="/sell" element={<CreateAuction />} />
          <Route path="/my-auctions" element={<MyAuctions />} />
          <Route path="/my-bids" element={<MyBids />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
