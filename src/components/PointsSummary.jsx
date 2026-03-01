import { formatStudyDuration } from '../utils/time'

function PointsSummary({ points, totalStudyTimeSeconds, tasksCompleted, gardenCount }) {
  const stats = [
    { label: 'Points', value: points, color: '#D4A017' },
    { label: 'Study Time', value: formatStudyDuration(totalStudyTimeSeconds), color: '#1B6B4A' },
    { label: 'Tasks Done', value: tasksCompleted, color: '#1A1A1A' },
    { label: 'Garden', value: gardenCount, color: '#1A1A1A' },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white p-4"
          style={{ border: '1px solid #E8E6E1' }}
        >
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: stat.color }}
          >
            {stat.value}
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: '#7A7A72' }}>
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  )
}

export default PointsSummary
