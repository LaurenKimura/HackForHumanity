import { useCallback, useEffect, useState, useRef } from 'react'

export const useStudyTimer = (initialSeconds, onFinished) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds || 0)
  const [isRunning, setIsRunning] = useState(false)
  const onFinishedRef = useRef(onFinished)

  // Update ref so we always use the latest callback without re-triggering effects
  useEffect(() => {
    onFinishedRef.current = onFinished
  }, [onFinished])

  // Sync remainingSeconds if initialSeconds changes while not running
  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(initialSeconds)
    }
  }, [initialSeconds, isRunning])

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          // Use timeout to ensure state update finishes before callback
          setTimeout(() => {
            if (onFinishedRef.current) {
              onFinishedRef.current()
            }
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const start = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true)
    }
  }, [remainingSeconds])

  const pause = useCallback(() => setIsRunning(false), [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setRemainingSeconds(initialSeconds)
  }, [initialSeconds])

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
  }
}