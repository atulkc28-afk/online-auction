// Small helper functions used across the app

export const CATEGORIES = ['Electronics', 'Fashion', 'Collectibles', 'Vehicles', 'Other']

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400?text=No+Image'

// 62000 -> "₹62,000"
export const formatPrice = (amount) =>
  '₹' + Number(amount).toLocaleString('en-IN')

// Returns "upcoming", "live" or "ended" based on the current time
export const getStatus = (auction) => {
  const now = Date.now()
  if (now < new Date(auction.start_time).getTime()) return 'upcoming'
  if (now >= new Date(auction.end_time).getTime()) return 'ended'
  return 'live'
}

// Finds the highest bid using reduce()
export const getWinningBid = (bids) => {
  if (!bids || bids.length === 0) return null
  return bids.reduce((best, bid) =>
    Number(bid.amount) > Number(best.amount) ? bid : best
  )
}

// Next minimum acceptable bid
export const getMinimumBid = (auction, bidCount) =>
  bidCount === 0
    ? Number(auction.starting_price)
    : Number(auction.current_price) + Number(auction.minimum_increment)
