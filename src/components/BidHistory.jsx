import { formatPrice } from '../lib/helpers'

export default function BidHistory({ bids }) {
  return (
    <div className="panel">
      <h3>Bid History</h3>
      {bids.length === 0 ? (
        <p className="empty">No bids yet. Be the first!</p>
      ) : (
        <ul className="bid-list">
          {bids.map((bid) => (
            <li key={bid.id}>
              <span>{bid.bidder_name}</span>
              <strong>{formatPrice(bid.amount)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
