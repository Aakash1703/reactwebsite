import { Routes, Route, NavLink } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">📚 CityLibrary</p>
          <nav className="footer-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} CityLibrary. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
