import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthForm from './components/AuthForm'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'
import GardenStorePage from './components/GardenStorePage'
import NavBar from './components/NavBar'
import YourGardenPage from './components/YourGardenPage'
import {
  logOutUser,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  subscribeToAuthChanges,
} from './firebase/auth'
import { missingFirebaseConfig } from './firebase/config'
import {
  addPoints,
  addStudyProgress,
  createTask,
  ensureUserProfile,
  listenToGarden,
  listenToTasks,
  listenToUserProfile,
  purchaseFlower,
  removeTask,
  updateGardenItemPosition,
  updateTask,
} from './firebase/firestore'
import { useStudyTimer } from './hooks/useStudyTimer'

const DEFAULT_TIMER_MINUTES = 25

function UserButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#5C4033',
        zIndex: 50,
        fontFamily: "'Cherry Bomb One', cursive",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="#5C4033"
        stroke="none"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8H4z" />
      </svg>
      <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>user</span>
    </button>
  )
}

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
  const [showLanding, setShowLanding] = useState(true)

  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [tasks, setTasks] = useState([])
  const [gardenItems, setGardenItems] = useState([])

  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [isGardenLoading, setIsGardenLoading] = useState(false)
  const [purchasingFlowerId, setPurchasingFlowerId] = useState('')
  const [appError, setAppError] = useState('')

  const [creditedMinutes, setCreditedMinutes] = useState(0)
  const [carryoverMinutes, setCarryoverMinutes] = useState(0)
  const [guestPoints, setGuestPoints] = useState(9999)
  const [isSyncingStudyProgress, setIsSyncingStudyProgress] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES)

  const { remainingSeconds, isRunning, start, pause, reset } = useStudyTimer(timerMinutes * 60)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
      if (user) setShowLanding(false)
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

  // Timer point system: every 5 minutes studied = 2 points, leftover carries over
  useEffect(() => {
    if (isSyncingStudyProgress) return

    const timerDuration = timerMinutes * 60
    const elapsedSeconds = timerDuration - remainingSeconds
    const reachedMinutes = Math.floor(elapsedSeconds / 60)
    if (reachedMinutes <= creditedMinutes) return

    const unsyncedMinutes = reachedMinutes - creditedMinutes
    const totalAvailable = unsyncedMinutes + carryoverMinutes
    const fiveMinBlocks = Math.floor(totalAvailable / 5)
    const pointsEarned = fiveMinBlocks * 2
    const leftover = totalAvailable - fiveMinBlocks * 5

    if (!currentUser) {
      // Guest mode: update locally
      if (pointsEarned > 0) {
        setGuestPoints((prev) => prev + pointsEarned)
      }
      setCarryoverMinutes(leftover)
      setCreditedMinutes(reachedMinutes)
      return
    }

    let isCancelled = false

    const syncStudyProgress = async () => {
      setIsSyncingStudyProgress(true)

      try {
        await addStudyProgress(currentUser.uid, unsyncedMinutes, pointsEarned)
        if (!isCancelled) {
          setCreditedMinutes((prev) => prev + unsyncedMinutes)
          setCarryoverMinutes(leftover)
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
  }, [currentUser, remainingSeconds, creditedMinutes, carryoverMinutes, isSyncingStudyProgress, timerMinutes])

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
    if (!currentUser) {
      // Guest mode: local tasks
      setTasks((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, title, completed: false },
      ])
      return
    }
    setAppError('')
    try {
      await createTask(currentUser.uid, title)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleToggleTask = async (taskId, isCompleted) => {
    const isNowCompleted = !isCompleted

    if (!currentUser) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: isNowCompleted } : t))
      )
      // Award 1 point for completing a task (not for uncompleting)
      if (isNowCompleted) {
        setGuestPoints((prev) => prev + 1)
      }
      return
    }
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { completed: isNowCompleted })
      // Award 1 point for completing a task
      if (isNowCompleted) {
        await addPoints(currentUser.uid, 1)
      }
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleRenameTask = async (taskId, title) => {
    if (!currentUser) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, title: title.trim() } : t))
      )
      return
    }
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { title: title.trim() })
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!currentUser) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      return
    }
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

  // Place a flower at a specific position
  const handlePlaceFlower = async (flower, x, y) => {
    if (currentUser) {
      setAppError('')
      try {
        await purchaseFlower(currentUser.uid, flower, x, y)
      } catch (error) {
        setAppError(getFriendlyErrorMessage(error))
      }
      return
    }
    // Guest mode
    if (guestPoints < flower.cost) return
    setGuestPoints((prev) => prev - flower.cost)
    setGardenItems((prev) => [
      ...prev,
      {
        id: `garden-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        flowerId: flower.id,
        x,
        y,
      },
    ])
  }

  // Move an existing garden item to a new position
  const handleMoveGardenItem = async (itemId, x, y) => {
    if (currentUser) {
      try {
        await updateGardenItemPosition(currentUser.uid, itemId, x, y)
      } catch (error) {
        setAppError(getFriendlyErrorMessage(error))
      }
      return
    }
    // Guest mode
    setGardenItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, x, y } : item))
    )
  }

  const points = useMemo(
    () => currentUser ? (profile.totalPoints ?? 0) : guestPoints,
    [currentUser, profile.totalPoints, guestPoints],
  )
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

  if (!currentUser && !isGuestMode && showLanding) {
    return (
      <>
        <UserButton onClick={() => setShowLanding(false)} />
        <LandingPage onContinue={() => setShowLanding(false)} />
      </>
    )
  }

  if (!currentUser && !isGuestMode) {
    return (
      <>
        <UserButton onClick={() => setShowLanding(true)} />
        <main style={{
          minHeight: '100vh',
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <AuthForm
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              onGoogleSignIn={handleGoogleSignIn}
              isSubmitting={isAuthSubmitting}
              errorMessage={authError}
            />
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontFamily: "'Cherry Bomb One', cursive",
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => setIsGuestMode(true)}
              type="button"
            >
              guest mode
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(180deg, #A8DFF0 0%, #C2ECFA 15%, #D6F0E8 30%, #E4F4EC 45%, #d8ecac 65%, #C9E6A0 80%, #B8D890 100%)',
      backgroundAttachment: 'fixed',
    }}>
      <div className="mx-auto max-w-7xl">
        <NavBar
          displayName={displayName}
          userInitials={userInitials}
          isGuestMode={isGuestMode}
          onLogOut={handleLogOut}
          onLogIn={() => setIsGuestMode(false)}
        />

        {appError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {appError}
          </p>
        ) : null}

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                points={points}
                totalStudyTime={totalStudyTime}
                tasksCompleted={tasksCompleted}
                gardenCount={gardenCount}
                tasks={tasks}
                isTasksLoading={isTasksLoading}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onRenameTask={handleRenameTask}
                remainingSeconds={remainingSeconds}
                isRunning={isRunning}
                isSyncingStudyProgress={isSyncingStudyProgress}
                onStart={start}
                onPause={pause}
                onReset={handleResetTimer}
                timerMinutes={timerMinutes}
                onSetTimerMinutes={setTimerMinutes}
              />
            }
          />
          <Route
            path="/store"
            element={
              <GardenStorePage
                points={points}
                onPurchase={handlePurchaseFlower}
                purchasingFlowerId={purchasingFlowerId}
              />
            }
          />
          <Route
            path="/garden"
            element={
              <YourGardenPage
                gardenItems={gardenItems}
                isLoading={isGardenLoading}
                points={points}
                onPurchase={handlePurchaseFlower}
                onPlaceFlower={handlePlaceFlower}
                onMoveGardenItem={handleMoveGardenItem}
                purchasingFlowerId={purchasingFlowerId}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
    </>
  )
}

export default App
