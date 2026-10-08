import AuctionCard from './AuctionCard'

export default function AuctionGrid({ auctions }) {
  if (auctions.length === 0) {
    return <p className="empty">No auctions found.</p>
  }

  return (
    <div className="grid">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
