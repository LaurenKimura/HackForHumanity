import { useMemo, useState } from 'react'

function TaskSidebar({ tasks, isLoading, onAddTask, onToggleTask, onDeleteTask, onRenameTask }) {
  const [newTitle, setNewTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState('')
  const [editingTitle, setEditingTitle] = useState('')

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((taskA, taskB) => {
        if (taskA.completed === taskB.completed) return 0
        return taskA.completed ? 1 : -1
      }),
    [tasks],
  )

  const handleCreateTask = async (event) => {
    event.preventDefault()
    if (!newTitle.trim()) return
    await onAddTask(newTitle)
    setNewTitle('')
  }

  const beginEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingTitle(task.title)
  }

  const cancelEditing = () => {
    setEditingTaskId('')
    setEditingTitle('')
  }

  const saveTaskTitle = async () => {
    if (!editingTaskId || !editingTitle.trim()) return
    await onRenameTask(editingTaskId, editingTitle)
    cancelEditing()
  }

  return (
    <aside
      style={{
        borderRadius: '24px',
        padding: '20px',
        fontFamily: "'Cherry Bomb One', cursive",
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        border: '2px solid rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 400,
          color: '#5C4033',
          margin: 0,
        }}
      >
        to-do list
      </h2>

      <form
        style={{ display: 'flex', gap: '8px', marginTop: '16px' }}
        onSubmit={handleCreateTask}
      >
        <input
          style={{
            flex: 1,
            borderRadius: '12px',
            border: '2px solid #E8DCC8',
            padding: '8px 12px',
            fontSize: '14px',
            fontFamily: "'Cherry Bomb One', cursive",
            color: '#5C4033',
            backgroundColor: '#FFFDF8',
            outline: 'none',
          }}
          placeholder="add a task..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button
          style={{
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: "'Cherry Bomb One', cursive",
            fontWeight: 400,
            color: '#fff',
            backgroundColor: '#6B7A3D',
            border: 'none',
            cursor: 'pointer',
          }}
          type="submit"
        >
          add
        </button>
      </form>

      {isLoading ? (
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#5C4033', opacity: 0.5 }}>
          loading tasks...
        </p>
      ) : null}
      {!isLoading && sortedTasks.length === 0 ? (
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#5C4033', opacity: 0.5 }}>
          no tasks yet. add your first one!
        </p>
      ) : null}

      <ul
        style={{
          listStyle: 'none',
          margin: '16px 0 0 0',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            style={{
              borderRadius: '12px',
              padding: '10px 12px',
              backgroundColor: task.completed ? 'rgba(168, 212, 106, 0.15)' : 'rgba(255, 255, 255, 0.7)',
              border: `1.5px solid ${task.completed ? '#C9E6A0' : '#E8DCC8'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                checked={Boolean(task.completed)}
                onChange={() => onToggleTask(task.id, task.completed)}
                type="checkbox"
                style={{
                  marginTop: '3px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#6B7A3D',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                {editingTaskId === task.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: '2px solid #C4A76C',
                        padding: '4px 8px',
                        fontSize: '14px',
                        fontFamily: "'Cherry Bomb One', cursive",
                        color: '#5C4033',
                        outline: 'none',
                        backgroundColor: '#FFFDF8',
                      }}
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTaskTitle()
                        if (e.key === 'Escape') cancelEditing()
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        style={{
                          borderRadius: '8px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontFamily: "'Cherry Bomb One', cursive",
                          color: '#fff',
                          backgroundColor: '#6B7A3D',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={saveTaskTitle}
                        type="button"
                      >
                        save
                      </button>
                      <button
                        style={{
                          borderRadius: '8px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontFamily: "'Cherry Bomb One', cursive",
                          color: '#5C4033',
                          backgroundColor: '#E8DCC8',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={cancelEditing}
                        type="button"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => beginEditing(task)}
                    type="button"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '14px',
                      fontFamily: "'Cherry Bomb One', cursive",
                      fontWeight: 400,
                      color: task.completed ? '#A0996E' : '#5C4033',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {task.title}
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => onDeleteTask(task.id)}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontFamily: "'Cherry Bomb One', cursive",
                  color: '#C47A6C',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default TaskSidebar
