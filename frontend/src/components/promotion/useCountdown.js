import { useEffect, useState } from 'react'

export function useCountdown(targetISO) {
  const getTimeLeft = () => Math.max(0, new Date(targetISO).getTime() - Date.now())
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetISO])

  const totalSeconds = Math.floor(timeLeft / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, done: timeLeft <= 0 }
}
