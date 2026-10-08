import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Fetches ONE auction (with product) and its bids, live-updating via Realtime.
export default function useBids(auctionId) {
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    const { data: a, error: e1 } = await supabase
      .from('auctions')
      .select('*, products(*)')
      .eq('id', auctionId)
      .single()

    const { data: b, error: e2 } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false })

    if (e1 || e2) setError((e1 || e2).message)
    else {
      setAuction(a)
      setBids(b)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('auction-' + auctionId + '-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids', filter: `auction_id=eq.${auctionId}` }, fetchData)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions', filter: `id=eq.${auctionId}` }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [auctionId])

  return { auction, bids, loading, error, refetch: fetchData }
}
