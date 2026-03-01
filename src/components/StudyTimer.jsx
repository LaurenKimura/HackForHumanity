import { useEffect, useRef } from 'react' // Import these from React
import { formatSecondsToClock } from '../utils/time'

function StudyTimer({ elapsedSeconds, isRunning, isSyncing, onStart, onPause, onReset }) {
  
  // 1. Setup the audio reference (Ensure your file is in /public/classical_piano.mp3)
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio object only once
    audioRef.current = new Audio('/classical_piano.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Set to 40% volume

    // Cleanup: Stop music if the component unmounts
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  // 2. Control music based on the 'isRunning' prop
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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-lg font-semibold text-slate-900">Study Timer</h2>
      <p className="mt-4 text-center text-5xl font-bold tracking-wider text-slate-900">
        {formatSecondsToClock(elapsedSeconds)}
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
            disabled={isSyncing}
          >
            Start
          </button>
        )}
        <button
          className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={() => {
            onReset();
            // Optional: stop music on reset
          }}
          type="button"
          disabled={isSyncing}
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        1 minute studied = 1 point {isSyncing ? '(syncing...)' : ''}
      </p>
    </section>
  )
}

export default StudyTimer