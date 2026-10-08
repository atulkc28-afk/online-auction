import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Fetches all auctions (with their product and bids).
// Re-fetches automatically whenever auctions or bids change (Realtime).
export default function useAuctions() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*, products(*), bids(*)')
      .order('end_time', { ascending: true })

    if (error) setError(error.message)
    else setAuctions(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAuctions()

    const channel = supabase
      .channel('auctions-list-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, fetchAuctions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, fetchAuctions)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { auctions, loading, error, refetch: fetchAuctions }
}
