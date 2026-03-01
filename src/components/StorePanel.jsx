import { FLOWERS } from '../data/flowers'

function StorePanel({ points, onPurchase, purchasingFlowerId }) {
  return (
    <aside
      className="h-full rounded-2xl bg-white p-4"
      style={{ border: '1px solid #E8E6E1' }}
    >
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
        >
          Garden Store
        </h2>
        <span
          className="text-sm font-bold"
          style={{ color: '#D4A017' }}
        >
          {points} pts
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {FLOWERS.map((flower) => {
          const canAfford = points >= flower.cost
          const isPurchasing = purchasingFlowerId === flower.id

          return (
            <li
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: '#F0EFEB' }}
              key={flower.id}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: '#E8F5E9' }}
              >
                {flower.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{flower.name}</p>
                <p className="text-xs" style={{ color: canAfford ? '#D4A017' : '#AAAA9F' }}>
                  {flower.cost} pts
                </p>
              </div>
              <button
                className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: canAfford ? '#1B6B4A' : '#AAAA9F' }}
                type="button"
                disabled={!canAfford || isPurchasing}
                onClick={() => onPurchase(flower)}
              >
                {isPurchasing ? '...' : 'Buy'}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default StorePanel
