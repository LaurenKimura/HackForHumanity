import { useEffect, useRef } from 'react' // Import these from React
import { formatSecondsToClock } from '../utils/time'

function StudyTimer({
  remainingSeconds,
  targetSeconds,
  isRunning,
  isSyncing,
  onStart,
  onPause,
  onReset,
  onSetTargetSeconds,
}) {
  // 1. Setup the audio reference (Ensure your file is in /public/classical_piano.mp3)
  const audioRef = useRef(null)

  useEffect(() => {
    // Initialize the audio object only once
    audioRef.current = new Audio('/classical_piano.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.4 // Set to 40% volume

    // Cleanup: Stop music if the component unmounts
    return () => {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  // 2. Control music based on the 'isRunning' prop
  useEffect(() => {
    if (audioRef.current) {
      if (isRunning) {
        audioRef.current.play().catch((error) => {
          console.log('Autoplay blocked. Music will start after user interaction.', error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isRunning])

  const durations = [
    { label: '1m', value: 1 * 60 },
    { label: '15m', value: 15 * 60 },
    { label: '25m', value: 25 * 60 },
    { label: '50m', value: 50 * 60 },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-lg font-semibold text-slate-900">Study Timer</h2>

      <div className="mt-4 flex justify-center gap-2">
        {durations.map((d) => (
          <button
            key={d.value}
            onClick={() => onSetTargetSeconds(d.value)}
            disabled={isRunning || isSyncing}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition ${targetSeconds === d.value
                ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-700'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              } disabled:opacity-50`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-5xl font-bold tracking-wider text-slate-900">
        {formatSecondsToClock(remainingSeconds)}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isRunning ? (
          <button
            className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
            onClick={onPause}
            type="button"
            disabled={isSyncing}
          >
            Pause
          </button>
        ) : (
          <button
            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
            onClick={onStart}
            type="button"
            disabled={isSyncing || remainingSeconds <= 0}
          >
            Start
          </button>
        )}
        <button
          className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onReset}
          type="button"
          disabled={isSyncing}
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Complete timer = {Math.floor(targetSeconds / 60)} points{' '}
        {isSyncing ? '(syncing...)' : ''}
      </p>
    </section>
  )
}

export default StudyTimer