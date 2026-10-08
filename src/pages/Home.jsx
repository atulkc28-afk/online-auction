import { Link } from 'react-router-dom'
import useAuctions from '../hooks/useAuctions'
import AuctionGrid from '../components/AuctionGrid'
import { getStatus } from '../lib/helpers'

export default function Home() {
  const { auctions, loading, error } = useAuctions()
  const liveAuctions = auctions.filter((a) => getStatus(a) === 'live').slice(0, 3)

  return (
    <div>
      <section className="hero">
        <h1>BID. WIN. OWN.</h1>
        <p>Discover unique products through online auctions.</p>
        <Link to="/auctions" className="btn">Browse Auctions</Link>
      </section>

      <section className="container">
        <h2>Live Auctions</h2>
        {loading && <div className="spinner"></div>}
        {error && <p className="error">❌ {error}</p>}
        {!loading && !error && <AuctionGrid auctions={liveAuctions} />}
      </section>
    </div>
  )
}
