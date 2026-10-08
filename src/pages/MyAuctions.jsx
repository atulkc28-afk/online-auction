import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice, getStatus, getWinningBid } from '../lib/helpers'

export default function MyAuctions() {
  const [name, setName] = useState('')
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    setError('')
    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select('*, auctions(*, bids(*))')
      .ilike('seller_name', name.trim())

    setLoading(false)
    if (error) return setError(error.message)
    setProducts(data)
  }

  // Flatten products -> auctions
  const myAuctions = (products || []).flatMap((p) =>
    p.auctions.map((a) => ({ ...a, product: p }))
  )

  return (
    <div className="container narrow">
      <h2>My Auctions</h2>

      <form onSubmit={handleSearch} className="form panel">
        <label>Enter Seller Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul" />
        <button className="btn">View My Auctions</button>
      </form>

      {error && <p className="error">❌ {error}</p>}
      {loading && <div className="spinner"></div>}

      {products && !loading && (
        <div>
          <h3>{name}'s Auctions</h3>
          {myAuctions.length === 0 && <p className="empty">No auctions found for this name.</p>}

          {myAuctions.map((a) => {
            const status = getStatus(a)
            const winner = getWinningBid(a.bids)
            return (
              <div key={a.id} className="row-card">
                <div>
                  <h4>{a.product.name}</h4>
                  <span className={`badge badge-${status}`}>{status.toUpperCase()}</span>
                  <p className="muted">
                    {status === 'ended'
                      ? winner
                        ? `🏆 Winner: ${winner.bidder_name}`
                        : 'No bids'
                      : `${a.bids.length} bids`}
                  </p>
                </div>
                <div className="right">
                  <p className="price">{formatPrice(a.current_price)}</p>
                  <Link to={`/auctions/${a.id}`} className="btn small">View</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
