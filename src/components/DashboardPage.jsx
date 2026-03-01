import PointsSummary from './PointsSummary'
import StudyTimer from './StudyTimer'
import TaskSidebar from './TaskSidebar'

function DashboardPage({
  points,
  totalStudyTime,
  tasksCompleted,
  gardenCount,
  tasks,
  isTasksLoading,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRenameTask,
  remainingSeconds,
  isRunning,
  isSyncingStudyProgress,
  onStart,
  onPause,
  onReset,
  timerMinutes,
  onSetTimerMinutes,
}) {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <PointsSummary
          points={points}
          totalStudyTimeSeconds={totalStudyTime}
          tasksCompleted={tasksCompleted}
          gardenCount={gardenCount}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px',
          fontFamily: "'Cherry Bomb One', cursive",
        }}
      >
        <TaskSidebar
          tasks={tasks}
          isLoading={isTasksLoading}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onRenameTask={onRenameTask}
        />

        <div>
          <StudyTimer
            remainingSeconds={remainingSeconds}
            isRunning={isRunning}
            isSyncing={isSyncingStudyProgress}
            onStart={onStart}
            onPause={onPause}
            onReset={onReset}
            timerMinutes={timerMinutes}
            onSetTimerMinutes={onSetTimerMinutes}
          />
        </div>

      </div>
    </>
  )
}

export default DashboardPage
