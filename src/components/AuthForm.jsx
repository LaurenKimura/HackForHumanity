import { useState } from 'react'

const INITIAL_FORM = {
  email: '',
  password: '',
  displayName: '',
}

function AuthForm({ onSignIn, onSignUp, onGoogleSignIn, isSubmitting, errorMessage }) {
  const [mode, setMode] = useState('signin')
  const [formState, setFormState] = useState(INITIAL_FORM)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'signin') {
      await onSignIn(formState.email, formState.password)
    } else {
      await onSignUp(formState.email, formState.password, formState.displayName)
    }
  }

  const submitLabel = mode === 'signin' ? 'Sign In' : 'Create Account'
  const toggleLabel =
    mode === 'signin'
      ? "Don't have an account? Create one"
      : 'Already have an account? Sign in'

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-2xl font-semibold text-slate-900">BloomFocus</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Study, earn points, and grow your garden.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <label className="block text-sm font-medium text-slate-700" htmlFor="displayName">
            Name
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Your name"
              value={formState.displayName}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="w-full rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : submitLabel}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-4">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs font-medium text-slate-400">OR</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={onGoogleSignIn}
        disabled={isSubmitting}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <button
        className="mt-6 w-full text-sm font-medium text-sky-700 transition hover:text-sky-800"
        type="button"
        onClick={() => {
          setMode((previous) => (previous === 'signin' ? 'signup' : 'signin'))
          setFormState(INITIAL_FORM)
        }}
      >
        {toggleLabel}
      </button>
    </div>
  )
}

export default AuthForm