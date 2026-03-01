import { Link } from 'react-router-dom'
import StorePanel from './StorePanel'

function GardenStorePage({ points, onPurchase, purchasingFlowerId }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="mb-1 inline-block text-sm font-medium transition"
            style={{ color: '#7A7A72' }}
          >
            &larr; Back to Dashboard
          </Link>
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
          >
            Garden Store
          </h2>
        </div>
        <div
          className="rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: '#FFF8E1', color: '#6D4C00', border: '1px solid #FFE082' }}
        >
          {points} pts
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: '#F0FAF0', border: '1px solid #C8E6C9' }}
      >
        <StorePanel
          points={points}
          onPurchase={onPurchase}
          purchasingFlowerId={purchasingFlowerId}
        />
      </div>

      <div className="mt-5 text-center">
        <Link
          to="/garden"
          className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: '#1B6B4A' }}
        >
          View Your Garden &rarr;
        </Link>
      </div>
    </div>
  )
}

export default GardenStorePage
