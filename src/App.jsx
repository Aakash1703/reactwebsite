import { Routes, Route, NavLink } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">📚 CityLibrary</p>
          <nav className="footer-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/books">Books</NavLink>
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
