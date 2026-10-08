import { Link } from 'react-router-dom'
import { formatPrice, getStatus, PLACEHOLDER_IMAGE } from '../lib/helpers'

export default function AuctionCard({ auction }) {
  const status = getStatus(auction)
  const product = auction.products
  const bidCount = auction.bids ? auction.bids.length : 0

  return (
    <div className="card">
      <img
        src={product.image_url || PLACEHOLDER_IMAGE}
        alt={product.name}
        onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
      />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.category}</p>

        <p className="label">{bidCount === 0 ? 'Starting Bid' : 'Current Bid'}</p>
        <p className="price">{formatPrice(auction.current_price)}</p>

        <p className="muted">{bidCount} {bidCount === 1 ? 'Bid' : 'Bids'}</p>

        <span className={`badge badge-${status}`}>
          {status === 'live' ? '🔴 LIVE' : status.toUpperCase()}
        </span>

        <Link to={`/auctions/${auction.id}`} className="btn">View Auction</Link>
      </div>
    </div>
  )
}
