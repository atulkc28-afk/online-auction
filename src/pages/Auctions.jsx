import { useState } from 'react'
import useAuctions from '../hooks/useAuctions'
import AuctionGrid from '../components/AuctionGrid'
import { CATEGORIES } from '../lib/helpers'

export default function Auctions() {
  const { auctions, loading, error } = useAuctions()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  // Filter by category, then search by name
  const filtered = auctions
    .filter((a) => category === 'All' || a.products.category === category)
    .filter((a) => a.products.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container">
      <h2>All Auctions</h2>

      <div className="filters">
        <input
          placeholder="Search auctions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <div className="spinner"></div>}
      {error && <p className="error">❌ {error}</p>}
      {!loading && !error && <AuctionGrid auctions={filtered} />}
    </div>
  )
}
