import { useRef } from 'react'
import { GARDEN_ITEMS } from '../data/flowers'

function StorePanel({ points, onPurchase, purchasingFlowerId }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const amount = 180
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#5C3D2E', fontFamily: '"Quicksand", sans-serif' }}>
          menu
        </h2>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ backgroundColor: '#F5E6D3' }}>
          <img src="/flower_one.png" alt="sprout" className="h-4 w-4 object-contain" />
          <span className="text-sm font-bold" style={{ color: '#5C3D2E' }}>{points} sprouts</span>
        </div>
      </div>

      <p className="mb-4 text-sm" style={{ color: '#7A6552' }}>
        earn sprouts while you study! spend them to decorate your garden.
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-1 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GARDEN_ITEMS.map((item) => {
            const canAfford = points >= item.cost
            const isPurchasing = purchasingFlowerId === item.id

            return (
              <button
                key={item.id}
                type="button"
                disabled={!canAfford || isPurchasing}
                onClick={() => onPurchase(item)}
                className="flex-shrink-0 rounded-2xl border-2 p-3 text-center transition"
                style={{
                  width: '140px',
                  borderColor: canAfford ? '#8DB956' : '#D1C7BC',
                  backgroundColor: canAfford ? '#F0F7E6' : '#FAF7F4',
                  opacity: isPurchasing ? 0.6 : 1,
                  cursor: canAfford && !isPurchasing ? 'pointer' : 'not-allowed',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto h-16 w-16 object-contain"
                />
                <p className="mt-2 text-sm font-semibold" style={{ color: '#5C3D2E' }}>
                  {item.name}
                </p>
                <span
                  className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: '#8DB956', color: '#fff' }}
                >
                  {item.cost} sprouts
                </span>
                {isPurchasing && (
                  <p className="mt-1 text-xs" style={{ color: '#8DB956' }}>Planting...</p>
                )}
                {!canAfford && !isPurchasing && (
                  <p className="mt-1 text-xs text-rose-500">Need {item.cost - points} more</p>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default StorePanel
