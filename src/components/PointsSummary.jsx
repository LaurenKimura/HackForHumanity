import { formatStudyDuration } from '../utils/time'

function PointsSummary({ points, totalStudyTimeSeconds, tasksCompleted }) {
  const stats = [
    { label: 'sprouts', value: points },
    { label: 'study time', value: formatStudyDuration(totalStudyTimeSeconds) },
    { label: 'tasks done', value: tasksCompleted },
  ]

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        fontFamily: "'Cherry Bomb One', cursive",
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            borderRadius: '16px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            border: '2px solid rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: '#5C4033',
              margin: 0,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#5C4033',
              opacity: 0.6,
              margin: '4px 0 0 0',
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  )
}

export default PointsSummary
