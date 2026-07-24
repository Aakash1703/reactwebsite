import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

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
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
