import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/helpers'

// Value for <input type="datetime-local"> in local time
const toLocalInput = (date) => {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function CreateAuction() {
  const navigate = useNavigate()
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    image_url: '',
    seller_name: '',
    starting_price: '',
    minimum_increment: '',
    start_time: toLocalInput(now),
    end_time: toLocalInput(tomorrow),
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!form.name.trim()) return setError('Product name is required.')
    if (!form.seller_name.trim()) return setError('Seller name is required.')
    if (!(Number(form.starting_price) > 0)) return setError('Starting price must be greater than ₹0.')
    if (!(Number(form.minimum_increment) > 0)) return setError('Minimum increment must be greater than ₹0.')
    if (new Date(form.end_time) <= new Date(form.start_time)) return setError('End time must be after start time.')

    setSaving(true)

    // 1) Insert the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: form.name.trim(),
        description: form.description,
        category: form.category,
        image_url: form.image_url.trim() || null,
        seller_name: form.seller_name.trim(),
      })
      .select()
      .single()

    if (productError) {
      setSaving(false)
      return setError(productError.message)
    }

    // 2) Insert the auction for that product
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .insert({
        product_id: product.id,
        starting_price: Number(form.starting_price),
        current_price: Number(form.starting_price),
        minimum_increment: Number(form.minimum_increment),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      })
      .select()
      .single()

    setSaving(false)

    if (auctionError) return setError(auctionError.message)

    setSuccess('✓ Auction created successfully!')
    setTimeout(() => navigate(`/auctions/${auction.id}`), 1200)
  }

  return (
    <div className="container narrow">
      <h2>Create Auction</h2>

      <form onSubmit={handleSubmit} className="form panel">
        <label>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label>Image URL (optional)</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />

        <label>Seller Name</label>
        <input name="seller_name" value={form.seller_name} onChange={handleChange} />

        <label>Starting Price (₹)</label>
        <input type="number" name="starting_price" value={form.starting_price} onChange={handleChange} />

        <label>Minimum Bid Increment (₹)</label>
        <input type="number" name="minimum_increment" value={form.minimum_increment} onChange={handleChange} />

        <label>Auction Start</label>
        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} />

        <label>Auction End</label>
        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />

        {error && <p className="error">❌ {error}</p>}
        {success && <p className="success">{success}</p>}

        <button className="btn" disabled={saving}>
          {saving ? 'Creating...' : 'CREATE AUCTION'}
        </button>
      </form>
    </div>
  )
}
