import { useMemo } from 'react'
import { FLOWERS } from '../data/flowers'

function GardenView({ gardenItems, isLoading }) {
  const flowerLookup = useMemo(
    () => new Map(FLOWERS.map((flower) => [flower.id, flower])),
    [],
  )

  return (
    <section
      className="rounded-2xl bg-white p-5"
      style={{ border: '1px solid #E8E6E1' }}
    >
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
        >
          Your Garden
        </h2>
        <button
          className="text-sm font-medium transition"
          style={{ color: '#1B6B4A' }}
          type="button"
        >
          View all
        </button>
      </div>

      <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: '#E8F5E9' }}>
        {isLoading ? (
          <div
            className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed text-sm"
            style={{ borderColor: '#1B6B4A', color: '#1B6B4A', opacity: 0.6 }}
          >
            Loading garden...
          </div>
        ) : gardenItems.length === 0 ? (
          <div
            className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed text-center text-sm"
            style={{ borderColor: '#1B6B4A', color: '#1B6B4A', opacity: 0.6 }}
          >
            Start your first focus session and buy a flower!
          </div>
        ) : (
          <div className="flex min-h-[6rem] gap-3 overflow-x-auto pb-1">
            {gardenItems.map((item) => {
              const flower = flowerLookup.get(item.flowerId)

              return (
                <div
                  className="flex flex-shrink-0 flex-col items-center rounded-lg bg-white/80 px-3 py-2"
                  key={item.id}
                  title={flower ? `${flower.name} (${flower.cost} points)` : 'Unknown flower'}
                >
                  <span className="text-2xl">{flower?.emoji ?? '🌱'}</span>
                  <span className="mt-1 text-center text-xs font-medium" style={{ color: '#1A1A1A' }}>
                    {flower?.name ?? item.flowerId}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default GardenView
