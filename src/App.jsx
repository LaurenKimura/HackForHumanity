import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import GardenView from './components/GardenView'
import PointsSummary from './components/PointsSummary'
import StorePanel from './components/StorePanel'
import StudyTimer from './components/StudyTimer'
import TaskSidebar from './components/TaskSidebar'
import {
  logOutUser,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  subscribeToAuthChanges,
} from './firebase/auth'
import { missingFirebaseConfig } from './firebase/config'
import {
  addStudyProgress,
  createTask,
  ensureUserProfile,
  listenToGarden,
  listenToTasks,
  listenToUserProfile,
  purchaseFlower,
  removeTask,
  updateTask,
} from './firebase/firestore'
import { useStudyTimer } from './hooks/useStudyTimer'

const TIMER_DURATION = 25 * 60

const EMPTY_PROFILE = {
  email: '',
  displayName: '',
  totalPoints: 0,
  totalStudyTime: 0,
}

const getFriendlyErrorMessage = (error) => {
  const code = error?.code ?? ''

  if (code === 'auth/invalid-credential') return 'Invalid email or password.'
  if (code === 'auth/email-already-in-use') return 'This email is already in use.'
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'
  if (code === 'auth/invalid-email') return 'Please enter a valid email.'

  return error?.message ?? 'Something went wrong. Please try again.'
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isGuestMode, setIsGuestMode] = useState(false)

  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [tasks, setTasks] = useState([])
  const [gardenItems, setGardenItems] = useState([])

  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [isGardenLoading, setIsGardenLoading] = useState(false)
  const [purchasingFlowerId, setPurchasingFlowerId] = useState('')
  const [appError, setAppError] = useState('')

  const [creditedMinutes, setCreditedMinutes] = useState(0)
  const [isSyncingStudyProgress, setIsSyncingStudyProgress] = useState(false)

  const { remainingSeconds, isRunning, start, pause, reset } = useStudyTimer(TIMER_DURATION)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!currentUser) {
      setProfile(EMPTY_PROFILE)
      setTasks([])
      setGardenItems([])
      setIsTasksLoading(false)
      setIsGardenLoading(false)
      setAppError('')
      setCreditedMinutes(0)
      reset()
      return undefined
    }

    let isCancelled = false

    setIsTasksLoading(true)
    setIsGardenLoading(true)
    setCreditedMinutes(0)
    setAppError('')

    ensureUserProfile(currentUser).catch((error) => {
      if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
    })

    const unsubscribeUser = listenToUserProfile(
      currentUser.uid,
      (nextProfile) => {
        if (isCancelled) return

        setProfile({
          email: nextProfile.email || currentUser.email || '',
          displayName: nextProfile.displayName || currentUser.displayName || '',
          totalPoints: nextProfile.totalPoints ?? 0,
          totalStudyTime: nextProfile.totalStudyTime ?? 0,
        })
      },
      (error) => {
        if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
      },
    )

    const unsubscribeTasks = listenToTasks(
      currentUser.uid,
      (nextTasks) => {
        if (isCancelled) return
        setTasks(nextTasks)
        setIsTasksLoading(false)
      },
      (error) => {
        if (isCancelled) return
        setAppError(getFriendlyErrorMessage(error))
        setIsTasksLoading(false)
      },
    )

    const unsubscribeGarden = listenToGarden(
      currentUser.uid,
      (nextGardenItems) => {
        if (isCancelled) return
        setGardenItems(nextGardenItems)
        setIsGardenLoading(false)
      },
      (error) => {
        if (isCancelled) return
        setAppError(getFriendlyErrorMessage(error))
        setIsGardenLoading(false)
      },
    )

    return () => {
      isCancelled = true
      unsubscribeUser()
      unsubscribeTasks()
      unsubscribeGarden()
    }
  }, [currentUser, reset])

  useEffect(() => {
    if (!currentUser || isSyncingStudyProgress) return

    const elapsedSeconds = TIMER_DURATION - remainingSeconds
    const reachedMinutes = Math.floor(elapsedSeconds / 60)
    if (reachedMinutes <= creditedMinutes) return

    let isCancelled = false
    const unsyncedMinutes = reachedMinutes - creditedMinutes

    const syncStudyProgress = async () => {
      setIsSyncingStudyProgress(true)

      try {
        await addStudyProgress(currentUser.uid, unsyncedMinutes)
        if (!isCancelled) {
          setCreditedMinutes((previousMinutes) => previousMinutes + unsyncedMinutes)
        }
      } catch (error) {
        if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
      } finally {
        if (!isCancelled) setIsSyncingStudyProgress(false)
      }
    }

    syncStudyProgress()

    return () => {
      isCancelled = true
    }
  }, [currentUser, remainingSeconds, creditedMinutes, isSyncingStudyProgress])

  const handleSignIn = async (email, password) => {
    setAuthError('')
    setIsAuthSubmitting(true)
    try {
      await signInWithEmail(email, password)
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error))
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleSignUp = async (email, password, displayName) => {
    setAuthError('')
    setIsAuthSubmitting(true)
    try {
      await signUpWithEmail(email, password, displayName)
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error))
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthError('')
    setIsAuthSubmitting(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error))
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleLogOut = async () => {
    setAppError('')
    try {
      await logOutUser()
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleResetTimer = () => {
    reset()
    setCreditedMinutes(0)
  }

  const handleAddTask = async (title) => {
    if (!currentUser) return
    setAppError('')
    try {
      await createTask(currentUser.uid, title)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleToggleTask = async (taskId, isCompleted) => {
    if (!currentUser) return
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { completed: !isCompleted })
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleRenameTask = async (taskId, title) => {
    if (!currentUser) return
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { title: title.trim() })
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!currentUser) return
    setAppError('')
    try {
      await removeTask(currentUser.uid, taskId)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handlePurchaseFlower = async (flower) => {
    if (!currentUser) return
    setAppError('')
    setPurchasingFlowerId(flower.id)

    try {
      await purchaseFlower(currentUser.uid, flower)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    } finally {
      setPurchasingFlowerId('')
    }
  }

  const points = useMemo(() => profile.totalPoints ?? 0, [profile.totalPoints])
  const totalStudyTime = useMemo(
    () => profile.totalStudyTime ?? 0,
    [profile.totalStudyTime],
  )
  const tasksCompleted = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks],
  )
  const gardenCount = gardenItems.length

  const displayName = profile.displayName || currentUser?.displayName || 'Guest'
  const userInitials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'G'

  if (missingFirebaseConfig.length > 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <h1 className="text-xl font-semibold">Firebase config missing</h1>
          <p className="mt-2 text-sm">
            Create a <code>.env</code> file using <code>.env.example</code> and add your Firebase
            project keys.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {missingFirebaseConfig.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </main>
    )
  }

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F8F7F4' }}>
        <p className="text-sm font-medium" style={{ color: '#7A7A72' }}>Loading...</p>
      </main>
    )
  }

  if (!currentUser && !isGuestMode) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center gap-4">
          <AuthForm
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
            isSubmitting={isAuthSubmitting}
            errorMessage={authError}
          />
          <button
            className="text-sm font-medium underline transition"
            style={{ color: '#7A7A72' }}
            onClick={() => setIsGuestMode(true)}
            type="button"
          >
            Skip — view as guest
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header
          className="mb-5 flex items-center justify-between pb-4"
          style={{ borderBottom: '1px solid #E8E6E1' }}
        >
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}
            >
              BloomFocus
            </h1>
            <p className="text-sm" style={{ color: '#7A7A72' }}>
              Gamified Study Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: '#1B6B4A' }}
            >
              {userInitials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{displayName}</p>
            </div>
            <button
              className="text-sm font-medium transition"
              style={{ color: '#7A7A72' }}
              onClick={isGuestMode ? () => setIsGuestMode(false) : handleLogOut}
              type="button"
            >
              {isGuestMode ? 'Log in' : 'Log out'}
            </button>
          </div>
        </header>

        {appError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {appError}
          </p>
        ) : null}

        <div className="mb-5">
          <PointsSummary
            points={points}
            totalStudyTimeSeconds={totalStudyTime}
            tasksCompleted={tasksCompleted}
            gardenCount={gardenCount}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr_280px]">
          <TaskSidebar
            tasks={tasks}
            isLoading={isTasksLoading}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onRenameTask={handleRenameTask}
          />

          <div className="space-y-5">
            <StudyTimer
              remainingSeconds={remainingSeconds}
              isRunning={isRunning}
              isSyncing={isSyncingStudyProgress}
              onStart={start}
              onPause={pause}
              onReset={handleResetTimer}
            />
            <GardenView gardenItems={gardenItems} isLoading={isGardenLoading} />
          </div>

          <StorePanel
            points={points}
            onPurchase={handlePurchaseFlower}
            purchasingFlowerId={purchasingFlowerId}
          />
        </div>
      </div>
    </main>
  )
}

export default App
