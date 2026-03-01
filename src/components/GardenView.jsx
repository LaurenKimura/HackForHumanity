import { useMemo } from 'react'
import { GARDEN_ITEMS } from '../data/flowers'

function GardenView({ gardenItems, isLoading }) {
  const itemLookup = useMemo(
    () => new Map(GARDEN_ITEMS.map((item) => [item.id, item])),
    [],
  )

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Your Garden</h2>
      <p className="mt-1 text-sm text-slate-500">Items you buy with sprouts appear here.</p>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-gradient-to-b from-sky-100 to-emerald-100 p-4">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 text-sm text-emerald-800">
            Loading garden...
          </div>
        ) : gardenItems.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 text-center text-sm text-emerald-800">
            Start your first focus session and buy a garden item!
          </div>
        ) : (
          <div className="grid min-h-48 grid-cols-4 gap-3 sm:grid-cols-6">
            {gardenItems.map((item) => {
              const gardenItem = itemLookup.get(item.flowerId)

              return (
                <div
                  className="flex flex-col items-center rounded-xl border border-white/60 bg-white/60 p-2 shadow-sm"
                  key={item.id}
                  title={gardenItem ? `${gardenItem.name} (${gardenItem.cost} sprouts)` : 'Unknown item'}
                >
                  <img
                    src={gardenItem?.image ?? '/flower_one.png'}
                    alt={gardenItem?.name ?? 'Garden item'}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="mt-1 text-center text-xs font-medium text-slate-700">
                    {gardenItem?.name ?? item.flowerId}
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
