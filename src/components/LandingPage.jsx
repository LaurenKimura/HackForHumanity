import { useMemo } from 'react'
import { GARDEN_ITEMS } from '../data/flowers'
import StorePanel from './StorePanel'

function LandingPage({
  profile,
  gardenItems,
  isGardenLoading,
  points,
  purchasingFlowerId,
  onPurchase,
  onNavigateToStudy,
  onLogOut,
}) {
  const itemLookup = useMemo(
    () => new Map(GARDEN_ITEMS.map((item) => [item.id, item])),
    [],
  )

  return (
    <div style={{ fontFamily: '"Quicksand", sans-serif' }}>
      {/* Section A: Hero */}
      <section
        style={{
          background: 'linear-gradient(to bottom, #C3EEFA 0%, #C3EEFA 80%, #D4F0D4 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          padding: '20px',
        }}
      >
        {/* Top bar: user info + logout */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#5C3D2E' }}>
            {profile.name || 'Guest'}
          </span>
          <button
            type="button"
            onClick={onLogOut}
            style={{
              background: 'none',
              border: '2px solid #5C3D2E',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#5C3D2E',
              cursor: 'pointer',
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            Log Out
          </button>
        </div>

        {/* Mascot */}
        <img
          src="/icon.png"
          alt="Mind Garden mascot"
          style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '20px' }}
        />

        {/* Heading */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#5C3D2E',
          margin: '0 0 12px 0',
          textAlign: 'center',
        }}>
          hello!
        </h1>

        <p style={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#7A6552',
          textAlign: 'center',
          maxWidth: '320px',
          margin: '0 0 32px 0',
          lineHeight: 1.5,
        }}>
          the brain grows constantly...just like a garden!
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onNavigateToStudy}
          style={{
            backgroundColor: '#5C3D2E',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: '"Quicksand", sans-serif',
            boxShadow: '0 4px 12px rgba(92, 61, 46, 0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          start watering your brain
        </button>

        {/* Decorative clouds */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '10%',
          width: '120px',
          height: '40px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: '9999px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '120px',
          right: '8%',
          width: '90px',
          height: '32px',
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderRadius: '9999px',
        }} />
      </section>

      {/* Section B: Garden Scene */}
      <section style={{
        background: 'linear-gradient(to bottom, #D4F0D4 0%, #8DB956 20%, #7CAF3A 100%)',
        padding: '40px 20px 60px',
        position: 'relative',
        minHeight: '400px',
      }}>
        {/* Fence */}
        <div style={{
          width: '100%',
          margin: '0 auto 24px',
          overflow: 'hidden',
          height: '60px',
        }}>
          <img
            src="/fence.png"
            alt="Garden fence"
            style={{ width: '100%', height: '60px', objectFit: 'cover' }}
          />
        </div>

        {/* Garden heading */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 24px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}>
          {profile.name ? `${profile.name}'s Garden` : 'Your Garden'}
        </h2>

        {/* Garden area */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          minHeight: '240px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Stone pathway */}
          <img
            src="/stone_pathway.png"
            alt="Stone pathway"
            style={{
              width: '180px',
              height: '300px',
              objectFit: 'contain',
              position: 'absolute',
              left: '50%',
              top: '20px',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Garden items */}
          {isGardenLoading ? (
            <p style={{ color: '#fff', fontWeight: 600, marginTop: '80px' }}>Loading garden...</p>
          ) : gardenItems.length === 0 ? (
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
              marginTop: '80px',
              textAlign: 'center',
              fontSize: '14px',
            }}>
              Your garden is empty. Earn sprouts to plant items!
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '20px',
              position: 'relative',
              zIndex: 1,
            }}>
              {gardenItems.map((item, index) => {
                const gardenItem = itemLookup.get(item.flowerId)
                // Offset items to create a natural garden layout
                const offsetY = index % 2 === 0 ? 0 : 20

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: `${offsetY}px`,
                    }}
                    title={gardenItem?.name ?? 'Garden item'}
                  >
                    <img
                      src={gardenItem?.image ?? '/flower_one.png'}
                      alt={gardenItem?.name ?? 'Garden item'}
                      style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                    />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#fff',
                      marginTop: '4px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}>
                      {gardenItem?.name ?? item.flowerId}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section C: Store / Menu */}
      <section style={{
        backgroundColor: '#FAF7F4',
        padding: '40px 20px 60px',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <StorePanel
            points={points}
            onPurchase={onPurchase}
            purchasingFlowerId={purchasingFlowerId}
          />
        </div>
      </section>
    </div>
  )
}

export default LandingPage
