import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

// Counts down to endTime. Calls onEnd() once when it reaches zero.
export default function CountdownTimer({ endTime, onEnd }) {
  const getLeft = () => new Date(endTime).getTime() - Date.now()
  const [left, setLeft] = useState(getLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getLeft()
      setLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        if (onEnd) onEnd()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  if (left <= 0) return <p className="timer ended">AUCTION ENDED</p>

  const totalSeconds = Math.floor(left / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <p className="timer">
      {days > 0 && `${days}d `}
      {pad(hours)} : {pad(minutes)} : {pad(seconds)}
    </p>
  )
}
