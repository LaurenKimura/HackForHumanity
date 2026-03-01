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

const EMPTY_PROFILE = {
  email: '',
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

  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [tasks, setTasks] = useState([])
  const [gardenItems, setGardenItems] = useState([])

  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [isGardenLoading, setIsGardenLoading] = useState(false)
  const [purchasingFlowerId, setPurchasingFlowerId] = useState('')
  const [appError, setAppError] = useState('')

  const [targetSeconds, setTargetSeconds] = useState(25 * 60) // Default 25 mins
  const [isSyncingStudyProgress, setIsSyncingStudyProgress] = useState(false)

  const handleTimerFinished = useCallback(async () => {
    if (!currentUser) return

    const minutes = Math.floor(targetSeconds / 60)
    if (minutes <= 0) return

    setIsSyncingStudyProgress(true)
    try {
      await addStudyProgress(currentUser.uid, minutes)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    } finally {
      setIsSyncingStudyProgress(false)
    }
  }, [currentUser, targetSeconds])

  const { remainingSeconds, isRunning, start, pause, reset } = useStudyTimer(
    targetSeconds,
    handleTimerFinished,
  )

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
      reset()
      return undefined
    }

    let isCancelled = false

    setIsTasksLoading(true)
    setIsGardenLoading(true)
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

  if (missingFirebaseConfig.length > 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm">
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
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm font-medium text-slate-600">Loading...</p>
      </main>
    )
  }

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <AuthForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onGoogleSignIn={handleGoogleSignIn}
          isSubmitting={isAuthSubmitting}
          errorMessage={authError}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Mind Garden</p>
            <h1 className="text-2xl font-bold text-slate-900">Gamified Study Dashboard</h1>
          </div>
          <button
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            onClick={handleLogOut}
            type="button"
          >
            Log Out
          </button>
        </header>

        {appError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {appError}
          </p>
        ) : null}

        <div className="mb-4">
          <PointsSummary
            name={profile.name}
            email={profile.email}
            points={points}
            totalStudyTimeSeconds={totalStudyTime}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px,1fr,300px]">
          <TaskSidebar
            tasks={tasks}
            isLoading={isTasksLoading}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onRenameTask={handleRenameTask}
          />

          <div className="space-y-4">
            <StudyTimer
              remainingSeconds={remainingSeconds}
              targetSeconds={targetSeconds}
              isRunning={isRunning}
              isSyncing={isSyncingStudyProgress}
              onStart={start}
              onPause={pause}
              onReset={handleResetTimer}
              onSetTargetSeconds={setTargetSeconds}
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