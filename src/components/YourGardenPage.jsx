import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FLOWERS } from '../data/flowers'

const ITEMS_PER_PAGE = 4

function YourGardenPage({
  gardenItems,
  isLoading,
  points,
  onPurchase,
  onPlaceFlower,
  onMoveGardenItem,
  purchasingFlowerId,
}) {
  const [scrollIndex, setScrollIndex] = useState(0)
  const sceneRef = useRef(null)

  // Drag state
  const [dragging, setDragging] = useState(null) // { type: 'store' | 'placed', flower, itemId, startX, startY }
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })

  const flowerLookup = useMemo(
    () => new Map(FLOWERS.map((f) => [f.id, f])),
    [],
  )

  const maxIndex = Math.max(0, FLOWERS.length - ITEMS_PER_PAGE)
  const visibleItems = FLOWERS.slice(scrollIndex, scrollIndex + ITEMS_PER_PAGE)

  const handlePrev = () => setScrollIndex((i) => Math.max(0, i - 1))
  const handleNext = () => setScrollIndex((i) => Math.min(maxIndex, i + 1))

  // Get position as percentage relative to scene container
  const getScenePercent = useCallback((clientX, clientY) => {
    if (!sceneRef.current) return null
    const rect = sceneRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }, [])

  // Start dragging from the store carousel
  const handleStoreMouseDown = useCallback((e, flower) => {
    if (points < flower.cost) return
    e.preventDefault()
    setDragging({ type: 'store', flower })
    setDragPos({ x: e.clientX, y: e.clientY })
  }, [points])

  // Start dragging an existing placed item
  const handlePlacedMouseDown = useCallback((e, item) => {
    e.preventDefault()
    e.stopPropagation()
    const flower = FLOWERS.find((f) => f.id === item.flowerId)
    setDragging({ type: 'placed', flower, itemId: item.id })
    setDragPos({ x: e.clientX, y: e.clientY })
  }, [])

  // Global mouse move/up while dragging
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e) => {
      setDragPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = (e) => {
      const pos = getScenePercent(e.clientX, e.clientY)

      if (pos && pos.y > 0 && pos.y < 100 && pos.x > 0 && pos.x < 100) {
        if (dragging.type === 'store' && onPlaceFlower) {
          onPlaceFlower(dragging.flower, pos.x, pos.y)
        } else if (dragging.type === 'placed' && onMoveGardenItem) {
          onMoveGardenItem(dragging.itemId, pos.x, pos.y)
        }
      }

      setDragging(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, getScenePercent, onPlaceFlower, onMoveGardenItem])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'auto',
        background: 'linear-gradient(180deg, #A8DFF0 0%, #C2ECFA 35%, #c4e280 60%, #c4e280 100%)',
        fontFamily: "'Cherry Bomb One', cursive",
        cursor: dragging ? 'grabbing' : 'default',
        userSelect: dragging ? 'none' : 'auto',
        zIndex: 40,
      }}
    >
      {/* Floating nav */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        <img src="/icon.png" alt="BloomFocus" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <Link
          to="/"
          style={{
            fontSize: '14px',
            fontFamily: "'Cherry Bomb One', cursive",
            textDecoration: 'none',
            color: '#5C4033',
            opacity: 0.5,
            padding: '6px 14px',
            borderRadius: '12px',
          }}
        >
          dashboard
        </Link>
        <span
          style={{
            fontSize: '14px',
            color: '#5C4033',
            backgroundColor: '#d8ecac',
            padding: '6px 14px',
            borderRadius: '12px',
          }}
        >
          your garden
        </span>
      </div>

      {/* Centered title */}
      <h1
        style={{
          textAlign: 'center',
          fontSize: '100px',
          fontWeight: 400,
          color: '#000000',
          fontFamily: "'Cherry Bomb One', cursive",
          margin: '60px 0 24px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        my garden
      </h1>

      {/* Drag ghost */}
      {dragging && dragging.flower && (
        <div
          style={{
            position: 'fixed',
            left: dragPos.x,
            top: dragPos.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none',
            opacity: 0.85,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
          }}
        >
          <img
            src={dragging.flower.image}
            alt=""
            style={{ height: `${140 * (dragging.flower.scale || 1)}px`, width: 'auto' }}
          />
        </div>
      )}

      {/* Garden scene */}
      <div
        ref={sceneRef}
        style={{
          position: 'relative',
          width: '100%',
          cursor: dragging ? 'copy' : 'default',
        }}
      >
        <img
          src="/background.png"
          alt=""
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <img
          src="/fence.png"
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Placed garden items */}
        {gardenItems.map((item) => {
          const flower = flowerLookup.get(item.flowerId)
          if (!flower || item.x == null || item.y == null) return null

          return (
            <div
              key={item.id}
              onMouseDown={(e) => handlePlacedMouseDown(e, item)}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -80%)',
                zIndex: 2 + Math.round(item.y),
                cursor: 'grab',
              }}
            >
              <img
                src={flower.image}
                alt={flower.name}
                style={{
                  height: `${120 * (flower.scale || 1)}px`,
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )
        })}

        {/* Drop zone hint when dragging */}
        {dragging && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 50,
              border: '3px dashed rgba(107, 122, 61, 0.4)',
              borderRadius: '12px',
              backgroundColor: 'rgba(107, 122, 61, 0.05)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Store section */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 32px 48px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <h2 style={{ color: '#5C4033', fontSize: '22px', fontWeight: 400, margin: 0 }}>
            garden store
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#6B7A3D',
              color: '#fff',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '14px',
            }}
          >
            {points} sprouts
          </div>
        </div>

        <p
          style={{
            color: '#5C4033',
            fontSize: '13px',
            fontWeight: 400,
            margin: '0 0 20px 0',
            maxWidth: '420px',
            lineHeight: 1.5,
            opacity: 0.7,
          }}
        >
          drag items from the store onto your garden to place them!
        </p>

        {/* Carousel card */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: '20px',
            padding: '24px 16px',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Left arrow */}
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            type="button"
            style={{
              position: 'absolute',
              left: '-18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: scrollIndex === 0 ? '#B8C098' : '#6B7A3D',
              color: '#fff',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              cursor: scrollIndex === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Cherry Bomb One', cursive",
              opacity: scrollIndex === 0 ? 0.4 : 1,
              boxShadow: '0 2px 8px rgba(92, 64, 51, 0.15)',
              zIndex: 2,
            }}
          >
            &lt;
          </button>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            disabled={scrollIndex >= maxIndex}
            type="button"
            style={{
              position: 'absolute',
              right: '-18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: scrollIndex >= maxIndex ? '#B8C098' : '#6B7A3D',
              color: '#fff',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              cursor: scrollIndex >= maxIndex ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Cherry Bomb One', cursive",
              opacity: scrollIndex >= maxIndex ? 0.4 : 1,
              boxShadow: '0 2px 8px rgba(92, 64, 51, 0.15)',
              zIndex: 2,
            }}
          >
            &gt;
          </button>

          {/* Items row */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              padding: '0 24px',
            }}
          >
            {visibleItems.map((flower) => {
              const canAfford = points >= flower.cost

              return (
                <div
                  key={flower.id}
                  onMouseDown={(e) => handleStoreMouseDown(e, flower)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid rgba(255, 255, 255, 0.7)',
                    borderRadius: '16px',
                    padding: '14px 10px 12px',
                    cursor: canAfford ? 'grab' : 'not-allowed',
                    opacity: canAfford ? 1 : 0.45,
                    flex: '1 1 0',
                    maxWidth: '200px',
                    fontFamily: "'Cherry Bomb One', cursive",
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (canAfford) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(92, 64, 51, 0.12)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    style={{
                      height: '100px',
                      width: 'auto',
                      maxWidth: '120px',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                    }}
                  />
                  <span style={{ color: '#5C4033', fontSize: '12px', fontWeight: 400, lineHeight: 1.2 }}>
                    {flower.name}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#5C4033',
                      color: '#fff',
                      borderRadius: '9999px',
                      padding: '3px 12px',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {flower.cost} sprouts
                  </span>
                </div>
              )
            })}
          </div>

          {/* Pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: i === scrollIndex ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === scrollIndex ? '#6B7A3D' : 'rgba(92, 64, 51, 0.2)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourGardenPage
