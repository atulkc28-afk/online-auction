import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice, getStatus, getWinningBid } from '../lib/helpers'

export default function MyBids() {
  const [name, setName] = useState('')
  const [bids, setBids] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    setError('')
    setLoading(true)

    const { data, error } = await supabase
      .from('bids')
      .select('*, auctions(*, products(*), bids(*))')
      .ilike('bidder_name', name.trim())

    setLoading(false)
    if (error) return setError(error.message)
    setBids(data)
  }

  // Keep only my highest bid for each auction
  const myBestBids = {}
  ;(bids || []).forEach((bid) => {
    const current = myBestBids[bid.auction_id]
    if (!current || Number(bid.amount) > Number(current.amount)) {
      myBestBids[bid.auction_id] = bid
    }
  })
  const list = Object.values(myBestBids)

  // Decide the label for each bid
  const getLabel = (bid) => {
    const auction = bid.auctions
    const top = getWinningBid(auction.bids)
    const iAmTop = top && top.bidder_name.toLowerCase() === name.trim().toLowerCase()

    if (getStatus(auction) === 'ended') {
      return iAmTop
        ? { text: '🏆 YOU WON', css: 'badge-won' }
        : { text: 'LOST', css: 'badge-ended' }
    }
    return iAmTop
      ? { text: '✅ WINNING', css: 'badge-live' }
      : { text: '⚠ OUTBID', css: 'badge-outbid' }
  }

  return (
    <div className="container narrow">
      <h2>My Bids</h2>

      <form onSubmit={handleSearch} className="form panel">
        <label>Enter Your Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Atul" />
        <button className="btn">View My Bids</button>
      </form>

      {error && <p className="error">❌ {error}</p>}
      {loading && <div className="spinner"></div>}

      {bids && !loading && (
        <div>
          {list.length === 0 && <p className="empty">No bids found for this name.</p>}

          {list.map((bid) => {
            const label = getLabel(bid)
            return (
              <div key={bid.id} className="row-card">
                <div>
                  <h4>{bid.auctions.products.name}</h4>
                  <p className="muted">Your Bid: {formatPrice(bid.amount)}</p>
                  <p className="muted">Current Bid: {formatPrice(bid.auctions.current_price)}</p>
                </div>
                <div className="right">
                  <span className={`badge ${label.css}`}>{label.text}</span>
                  <Link to={`/auctions/${bid.auction_id}`} className="btn small">View</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
