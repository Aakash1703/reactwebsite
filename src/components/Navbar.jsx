import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          📚 CityLibrary
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/books" onClick={closeMenu}>
            Books
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {isAuthenticated ? (
            <>
              {user?.username && <span className="nav-user">Hi, {user.username}</span>}
              <button type="button" className="nav-logout" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
