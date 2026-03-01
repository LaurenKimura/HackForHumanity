export default function LandingPage({ onContinue }) {
  return (
    <div
      style={{
        backgroundColor: '#B8E8E8',
        fontFamily: "'Cherry Bomb One', cursive",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Center content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10vh',
          gap: '1rem',
          zIndex: 1,
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        <img
          src="/icon.png"
          alt="BloomFocus mascot"
          style={{ width: '190px', height: 'auto' }}
        />

        <h1
          style={{
            color: '#5C4033',
            fontSize: '24px',
            fontWeight: 400,
            margin: 0,
          }}
        >
          hello!
        </h1>

        <p
          style={{
            color: '#5C4033',
            fontSize: '36px',
            fontWeight: 400,
            margin: 0,
            maxWidth: '420px',
            lineHeight: 1.3,
          }}
        >
          the brain grows constantly...just like a garden!
        </p>

        <button
          onClick={onContinue}
          type="button"
          style={{
            marginTop: '1rem',
            backgroundColor: '#5C4033',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem 2.5rem',
            fontSize: '18px',
            fontFamily: "'Cherry Bomb One', cursive",
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          start watering your brain
        </button>
      </div>

{/* Background image removed — solid sky color */}
    </div>
  )
}
