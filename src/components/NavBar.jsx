import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'dashboard' },
  { to: '/garden', label: 'your garden' },
]

function NavBar({ displayName, userInitials, isGuestMode, onLogOut, onLogIn }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        marginBottom: '20px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
        fontFamily: "'Cherry Bomb One', cursive",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <img
          src="/icon.png"
          alt="BloomFocus"
          style={{ width: '72px', height: '72px', objectFit: 'contain' }}
        />
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: "'Cherry Bomb One', cursive",
                textDecoration: 'none',
                backgroundColor: isActive ? '#d8ecac' : 'transparent',
                color: isActive ? '#5C4033' : '#5C4033',
                opacity: isActive ? 1 : 0.5,
                transition: 'all 0.2s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div />
    </header>
  )
}

export default NavBar
