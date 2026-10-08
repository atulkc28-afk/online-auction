import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useBids from '../hooks/useBids'
import BidForm from '../components/BidForm'
import BidHistory from '../components/BidHistory'
import CountdownTimer from '../components/CountdownTimer'
import { formatPrice, getStatus, getWinningBid, PLACEHOLDER_IMAGE } from '../lib/helpers'

export default function AuctionDetails() {
  const { id } = useParams()
  const { auction, bids, loading, error, refetch } = useBids(id)
  const finalizing = useRef(false)

  // When the auction has ended, mark it completed and save the winner
  const finalizeAuction = async () => {
    if (!auction || auction.status === 'completed' || finalizing.current) return
    finalizing.current = true
    const winner = getWinningBid(bids)
    await supabase
      .from('auctions')
      .update({ status: 'completed', winner_name: winner ? winner.bidder_name : null })
      .eq('id', auction.id)
    refetch()
  }

  useEffect(() => {
    if (auction && getStatus(auction) === 'ended') finalizeAuction()
  }, [auction])

  if (loading) return <div className="spinner"></div>
  if (error || !auction) return <p className="error container">❌ {error || 'Auction not found'}</p>

  const product = auction.products
  const status = getStatus(auction)
  const winner = getWinningBid(bids)

  return (
    <div className="container">
      <Link to="/auctions" className="back">← Back to auctions</Link>

      <div className="details">
        <img
          src={product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
        />

        <div className="panel">
          <h2>{product.name}</h2>
          <p className="muted">Seller: {product.seller_name} · Category: {product.category}</p>
          <p>{product.description}</p>

          <p className="label">Starting Price</p>
          <p>{formatPrice(auction.starting_price)}</p>

          <p className="label">Current Bid</p>
          <p className="price big">{formatPrice(auction.current_price)}</p>

          {status === 'upcoming' && (
            <p className="muted">Starts on {new Date(auction.start_time).toLocaleString()}</p>
          )}

          {status !== 'upcoming' && (
            <>
              <p className="label">Auction ends in</p>
              <CountdownTimer endTime={auction.end_time} onEnd={refetch} />
            </>
          )}

          {status === 'live' && (
            <BidForm auction={auction} bidCount={bids.length} onBidPlaced={refetch} />
          )}

          {status === 'ended' && (
            <div className="winner">
              {winner ? (
                <>
                  <h3>🏆 Winner: {winner.bidder_name}</h3>
                  <p>Winning Bid: {formatPrice(winner.amount)}</p>
                </>
              ) : (
                <h3>Ended with no bids</h3>
              )}
            </div>
          )}
        </div>
      </div>

      <BidHistory bids={bids} />
    </div>
  )
}
