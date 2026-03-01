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

  const cardStyle = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'rgba(250, 248, 243, 0.92)',
    borderRadius: '20px',
    padding: '48px',
    fontFamily: "'Cherry Bomb One', cursive",
  }

  const titleStyle = {
    textAlign: 'center',
    fontSize: '32px',
    color: '#C4A76C',
    margin: '0 0 32px 0',
    fontFamily: "'Cherry Bomb One', cursive",
    fontWeight: 400,
    textTransform: 'lowercase',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '18px',
    color: '#C4A76C',
    marginBottom: '8px',
    fontFamily: "'Cherry Bomb One', cursive",
    fontWeight: 400,
    textTransform: 'lowercase',
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#fff',
    border: '2px solid #C4A76C',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: "'Cherry Bomb One', cursive",
    outline: 'none',
    boxSizing: 'border-box',
    color: '#5C4033',
  }

  const errorStyle = {
    padding: '12px 16px',
    backgroundColor: 'rgba(250, 248, 243, 0.8)',
    border: '2px solid #C4A76C',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#5C4033',
    fontFamily: "'Cherry Bomb One', cursive",
  }

  const bottomRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
  }

  const contactLinkStyle = {
    color: '#3D5A1E',
    fontSize: '18px',
    fontFamily: "'Cherry Bomb One', cursive",
    fontWeight: 400,
    textDecoration: 'underline',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textTransform: 'lowercase',
  }

  const buttonStyle = {
    backgroundColor: '#C4A76C',
    color: '#fff',
    border: 'none',
    borderRadius: '9999px',
    padding: '12px 48px',
    fontSize: '18px',
    fontFamily: "'Cherry Bomb One', cursive",
    fontWeight: 400,
    cursor: 'pointer',
    textTransform: 'lowercase',
    minWidth: '140px',
  }

  const submitLabel = mode === 'signin' ? 'log in' : 'sign up'

  return (
    <div style={cardStyle}>
      <h1 style={titleStyle}>mind garden</h1>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="displayName">
              name
            </label>
            <input
              style={inputStyle}
              id="displayName"
              name="displayName"
              type="text"
              value={formState.displayName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="email">
            email
          </label>
          <input
            style={inputStyle}
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="password">
            password
          </label>
          <input
            style={inputStyle}
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        {errorMessage ? (
          <div style={{ marginBottom: '20px' }}>
            <p style={errorStyle}>{errorMessage}</p>
          </div>
        ) : null}

        <div style={bottomRowStyle}>
          <button
            style={contactLinkStyle}
            type="button"
            onClick={() => {
              setMode((previous) => (previous === 'signin' ? 'signup' : 'signin'))
              setFormState(INITIAL_FORM)
            }}
          >
            {mode === 'signin' ? 'create account' : 'sign in'}
          </button>
          <button
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'wait...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthForm
