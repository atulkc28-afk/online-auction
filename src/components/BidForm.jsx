import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice, getMinimumBid, getStatus } from '../lib/helpers'

export default function BidForm({ auction, bidCount, onBidPlaced }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const minimumBid = getMinimumBid(auction, bidCount)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const bid = Number(amount)

    // Validation
    if (getStatus(auction) !== 'live') return setError('This auction is not live.')
    if (!name.trim()) return setError('Please enter your name.')
    if (!bid || bid <= 0) return setError('Please enter a valid bid.')
    if (bid < minimumBid) return setError(`Your bid must be at least ${formatPrice(minimumBid)}.`)

    setSaving(true)

    // 1) Save the bid
    const { error: bidError } = await supabase
      .from('bids')
      .insert({ auction_id: auction.id, bidder_name: name.trim(), amount: bid })

    if (bidError) {
      setSaving(false)
      return setError(bidError.message)
    }

    // 2) Update the auction's current price
    const { error: updateError } = await supabase
      .from('auctions')
      .update({ current_price: bid })
      .eq('id', auction.id)

    setSaving(false)

    if (updateError) return setError(updateError.message)

    setSuccess('✓ Bid placed successfully!')
    setAmount('')
    onBidPlaced()
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <p className="muted">Minimum next bid: <strong>{formatPrice(minimumBid)}</strong></p>

      <label>Your Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Atul" />

      <label>Your Bid (₹)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={String(minimumBid)}
      />

      {error && <p className="error">❌ {error}</p>}
      {success && <p className="success">{success}</p>}

      <button className="btn" disabled={saving}>
        {saving ? 'Placing...' : 'PLACE BID'}
      </button>
    </form>
  )
}
