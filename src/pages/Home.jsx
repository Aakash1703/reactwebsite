import { useEffect, useState } from 'react'
import libraryHero from '../assets/lib.png'
import './Home.css'

const categories = [
  { icon: '📖', name: 'Fiction', description: 'Novels and short stories' },
  { icon: '🔬', name: 'Non-Fiction', description: 'Facts, ideas, and real life' },
  { icon: '🚀', name: 'Sci-Fi & Fantasy', description: 'Other worlds, other rules' },
  { icon: '🔍', name: 'Mystery & Thriller', description: 'Suspense and page-turners' },
  { icon: '🧒', name: "Children's", description: 'Picture books and young readers' },
  { icon: '📜', name: 'Biography', description: 'Lives worth reading about' },
]

const AUTHORS_API_URL = 'https://db-lwbwu263ra-uc.a.run.app/browse-by-author'
const AUTHORS_DB_API_URL = 'https://db-lwbwu263ra-uc.a.run.app/browse-by-author-db'

function useAuthors(url) {
  const [authors, setAuthors] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setAuthors(data.authors ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { authors, error }
}

function Home() {
  const { authors, error: authorsError } = useAuthors(AUTHORS_API_URL)
  const { authors: authorsDb, error: authorsDbError } = useAuthors(AUTHORS_DB_API_URL)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to CityLibrary</h1>
          <p>
            Browse the catalog, check book availability, and manage your
            reading list, all in one place.
          </p>
        </div>
        <img
          src={libraryHero}
          alt="Illustration of a library bookshelf with an open book"
          className="hero-image"
        />
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-tile" key={category.name}>
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="authors">
        <h2>Browse by Author (API)</h2>
        <p className="authors-source">Served from an in-memory list in FastAPI</p>
        {authorsError && (
          <p className="authors-error">Couldn't load authors: {authorsError}</p>
        )}
        <div className="author-grid">
          {authors.map((author) => (
            <div className="author-tile" key={author}>
              <span className="author-icon">✍️</span>
              <h3>{author}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="authors">
        <h2>Browse by Author (Database)</h2>
        <p className="authors-source">Served from a SQLite database queried by FastAPI</p>
        {authorsDbError && (
          <p className="authors-error">Couldn't load authors: {authorsDbError}</p>
        )}
        <div className="author-grid">
          {authorsDb.map((author) => (
            <div className="author-tile" key={author}>
              <span className="author-icon">🗄️</span>
              <h3>{author}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
