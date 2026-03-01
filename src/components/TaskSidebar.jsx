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
      className="h-full rounded-2xl bg-white p-4"
      style={{ border: '1px solid #E8E6E1' }}
    >
      <h2
        className="text-lg font-semibold"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
      >
        To-Do List
      </h2>

      <form className="mt-4 flex gap-2" onSubmit={handleCreateTask}>
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition"
          style={{
            borderColor: '#E8E6E1',
            color: '#1A1A1A',
          }}
          placeholder="Add a task..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button
          className="rounded-xl px-3 py-2 text-sm font-medium text-white transition"
          style={{ backgroundColor: '#1B6B4A' }}
          type="submit"
        >
          Add
        </button>
      </form>

      {isLoading ? <p className="mt-4 text-sm" style={{ color: '#7A7A72' }}>Loading tasks...</p> : null}
      {!isLoading && sortedTasks.length === 0 ? (
        <p className="mt-4 text-sm" style={{ color: '#7A7A72' }}>No tasks yet. Add your first one.</p>
      ) : null}

      <ul className="mt-4 space-y-2">
        {sortedTasks.map((task) => (
          <li
            className="rounded-xl p-3 text-sm"
            style={{ backgroundColor: '#F0EFEB' }}
            key={task.id}
          >
            <div className="flex items-start gap-2">
              <input
                checked={Boolean(task.completed)}
                className="mt-1 h-4 w-4 accent-[#1B6B4A]"
                onChange={() => onToggleTask(task.id, task.completed)}
                type="checkbox"
              />

              <div className="min-w-0 flex-1">
                {editingTaskId === task.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border px-2 py-1 text-sm outline-none"
                      style={{ borderColor: '#E8E6E1' }}
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg px-2 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: '#1B6B4A' }}
                        onClick={saveTaskTitle}
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="rounded-lg px-2 py-1 text-xs font-medium"
                        style={{ backgroundColor: '#E8E6E1', color: '#1A1A1A' }}
                        onClick={cancelEditing}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`w-full text-left ${task.completed ? 'line-through' : ''}`}
                    style={{ color: task.completed ? '#AAAA9F' : '#1A1A1A' }}
                    onClick={() => beginEditing(task)}
                    type="button"
                  >
                    {task.title}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
                onClick={() => onDeleteTask(task.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default TaskSidebar
