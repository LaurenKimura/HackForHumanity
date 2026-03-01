import { useEffect, useRef } from 'react'
import { formatSecondsToClock } from '../utils/time'

function StudyTimer({ remainingSeconds, isRunning, isSyncing, onStart, onPause, onReset }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/classical_piano.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isRunning) {
        audioRef.current.play().catch((error) => {
          console.log("Autoplay blocked. Music will start after user interaction.", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning]);

  return (
    <section
      className="rounded-2xl bg-white p-6"
      style={{ border: '1px solid #E8E6E1' }}
    >
      <h2
        className="text-center text-lg font-semibold"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
      >
        Study Timer
      </h2>
      <p
        className="mt-4 text-center text-7xl font-bold tracking-wider"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
      >
        {formatSecondsToClock(remainingSeconds)}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isRunning ? (
          <button
            className="rounded-xl px-5 py-2.5 font-medium text-white transition"
            style={{ backgroundColor: '#D4A017' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8890F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4A017'}
            onClick={onPause}
            type="button"
            disabled={isSyncing}
          >
            Pause
          </button>
        ) : (
          <button
            className="rounded-xl px-5 py-2.5 font-medium text-white transition"
            style={{ backgroundColor: '#1B6B4A' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#155A3E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1B6B4A'}
            onClick={onStart}
            type="button"
            disabled={isSyncing}
          >
            Start
          </button>
        )}
        <button
          className="rounded-xl px-5 py-2.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ color: '#7A7A72', border: '1px solid #E8E6E1' }}
          onClick={onReset}
          type="button"
          disabled={isSyncing}
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-center text-xs" style={{ color: '#AAAA9F' }}>
        1 minute studied = 1 point {isSyncing ? '(syncing...)' : ''}
      </p>
    </section>
  )
}

export default StudyTimer
