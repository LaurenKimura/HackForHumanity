import { useEffect, useRef, useState } from 'react'
import { formatSecondsToClock } from '../utils/time'

function StudyTimer({ remainingSeconds, isRunning, isSyncing, onStart, onPause, onReset, timerMinutes, onSetTimerMinutes }) {
  const PLAYLIST = Array.from({ length: 11 }, (_, i) => `/music${i + 1}.mp3`);
  const audioRef = useRef(null);
  const trackIndexRef = useRef(0);
  const endSoundRef = useRef(null);
  const prevSecondsRef = useRef(remainingSeconds);
  const wasRunningRef = useRef(false);
  const [editValue, setEditValue] = useState(String(timerMinutes));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(String(timerMinutes));
    }
  }, [timerMinutes, isEditing]);

  // Load a track and attach the "ended" handler to auto-advance
  const loadTrack = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }
    trackIndexRef.current = index;
    const audio = new Audio(PLAYLIST[index]);
    audio.volume = 0.4;
    audio.onended = () => {
      const nextIndex = (trackIndexRef.current + 1) % PLAYLIST.length;
      loadTrack(nextIndex);
      if (wasRunningRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
    audioRef.current = audio;
  };

  useEffect(() => {
    loadTrack(0);

    endSoundRef.current = new Audio('/endTimerSound.mp3');
    endSoundRef.current.volume = 0.7;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
      endSoundRef.current = null;
    };
  }, []);

  // Play end sound when timer reaches 0
  useEffect(() => {
    if (prevSecondsRef.current > 0 && remainingSeconds === 0 && endSoundRef.current) {
      endSoundRef.current.currentTime = 0;
      endSoundRef.current.play().catch(() => {});
    }
    prevSecondsRef.current = remainingSeconds;
  }, [remainingSeconds]);

  useEffect(() => {
    wasRunningRef.current = isRunning;
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

  const commitMinutes = (val) => {
    const num = Math.max(1, Math.min(120, Math.round(Number(val) || 1)));
    onSetTimerMinutes(num);
    setEditValue(String(num));
    setIsEditing(false);
  };

  const nudge = (delta) => {
    const next = Math.max(1, Math.min(120, timerMinutes + delta));
    onSetTimerMinutes(next);
  };

  const canEdit = !isRunning && !isSyncing;

  const arrowBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: canEdit ? 'pointer' : 'not-allowed',
    opacity: canEdit ? 1 : 0.3,
    padding: '4px 8px',
    fontSize: '20px',
    color: '#5C4033',
    fontFamily: "'Cherry Bomb One', cursive",
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <section
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Cherry Bomb One', cursive",
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sky gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #A8DFF0 0%, #C8ECFA 40%, #E4F4EC 70%, #C9E6A0 85%, #A8D46A 100%)',
          zIndex: 0,
        }}
      />

      {/* Cloud 1 — large, left */}
      <div
        style={{
          position: 'absolute',
          top: '25px',
          left: '30px',
          width: '140px',
          height: '45px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '40px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '25px',
            width: '55px',
            height: '55px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '55px',
            width: '70px',
            height: '65px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Cloud 2 — small, right */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
          width: '100px',
          height: '32px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '30px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '40px',
            width: '50px',
            height: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Cloud 3 — tiny, center-right */}
      <div
        style={{
          position: 'absolute',
          top: '15px',
          right: '200px',
          width: '70px',
          height: '22px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '20px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '15px',
            width: '35px',
            height: '35px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Rolling hills at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          width: '110%',
          height: '80px',
          background: 'radial-gradient(ellipse 70% 100% at 25% 100%, #8BBF5A 0%, transparent 70%), radial-gradient(ellipse 80% 100% at 75% 100%, #9ACA6B 0%, transparent 70%), linear-gradient(180deg, transparent 0%, #A8D46A 100%)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          zIndex: 1,
        }}
      />

      {/* Small flowers on the ground */}
      <div style={{ position: 'absolute', bottom: '18px', left: '15%', zIndex: 2, fontSize: '14px', opacity: 0.7 }}>
        🌸
      </div>
      <div style={{ position: 'absolute', bottom: '22px', left: '70%', zIndex: 2, fontSize: '12px', opacity: 0.6 }}>
        🌼
      </div>
      <div style={{ position: 'absolute', bottom: '15px', right: '20%', zIndex: 2, fontSize: '16px', opacity: 0.5 }}>
        🌿
      </div>

      {/* Timer content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 24px 60px',
          flex: 1,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 400,
            color: '#5C4033',
            margin: 0,
          }}
        >
          study timer
        </h2>

        {/* Editable minutes row */}
        {canEdit ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
            <button
              style={arrowBtnStyle}
              onClick={() => nudge(-1)}
              disabled={!canEdit}
              type="button"
              aria-label="Decrease minutes"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8L10 13L5 8" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 10 10)" />
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <input
                type="text"
                inputMode="numeric"
                value={isEditing ? editValue : String(timerMinutes)}
                onFocus={() => {
                  setIsEditing(true);
                  setEditValue(String(timerMinutes));
                }}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setEditValue(raw);
                }}
                onBlur={() => commitMinutes(editValue)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    nudge(1);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    nudge(-1);
                  }
                }}
                style={{
                  width: '60px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontFamily: "'Cherry Bomb One', cursive",
                  fontWeight: 400,
                  color: '#5C4033',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  border: '2px solid #C4A76C',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '16px', color: '#5C4033', opacity: 0.6 }}>min</span>
            </div>
            <button
              style={arrowBtnStyle}
              onClick={() => nudge(1)}
              disabled={!canEdit}
              type="button"
              aria-label="Increase minutes"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8L10 13L5 8" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 10 10)" />
              </svg>
            </button>
          </div>
        ) : null}

        <p
          style={{
            textAlign: 'center',
            fontSize: '72px',
            fontWeight: 400,
            color: '#5C4033',
            letterSpacing: '0.05em',
            margin: '16px 0 0 0',
            textShadow: '0 2px 8px rgba(255,255,255,0.5)',
          }}
        >
          {formatSecondsToClock(remainingSeconds)}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          {isRunning ? (
            <button
              style={{
                backgroundColor: '#C4A76C',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 28px',
                fontSize: '16px',
                fontFamily: "'Cherry Bomb One', cursive",
                fontWeight: 400,
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                opacity: isSyncing ? 0.5 : 1,
                boxShadow: '0 2px 8px rgba(92, 64, 51, 0.15)',
              }}
              onClick={onPause}
              type="button"
              disabled={isSyncing}
            >
              pause
            </button>
          ) : (
            <button
              style={{
                backgroundColor: '#5C4033',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 28px',
                fontSize: '16px',
                fontFamily: "'Cherry Bomb One', cursive",
                fontWeight: 400,
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                opacity: isSyncing ? 0.5 : 1,
                boxShadow: '0 2px 8px rgba(92, 64, 51, 0.2)',
              }}
              onClick={onStart}
              type="button"
              disabled={isSyncing}
            >
              start
            </button>
          )}
          <button
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              color: '#5C4033',
              border: '2px solid #C4A76C',
              borderRadius: '9999px',
              padding: '10px 28px',
              fontSize: '16px',
              fontFamily: "'Cherry Bomb One', cursive",
              fontWeight: 400,
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              opacity: isSyncing ? 0.4 : 1,
            }}
            onClick={onReset}
            type="button"
            disabled={isSyncing}
          >
            reset
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#5C4033',
            fontWeight: 400,
            marginTop: '16px',
            opacity: 0.6,
          }}
        >
          5 minutes = 2 sprouts {isSyncing ? '(syncing...)' : ''}
        </p>
      </div>
    </section>
  )
}

export default StudyTimer
