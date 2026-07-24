import { useState } from 'react'
import libraryHero from '../assets/library-hero.svg'
import './Home.css'

const initialBooks = [
  { id: 1, title: 'The Silent Ocean', author: 'Mara Lindqvist', status: 'Available' },
  { id: 2, title: 'Atoms & Empires', author: 'D. R. Faulkner', status: 'Checked Out' },
  { id: 3, title: 'Gardens of Rust', author: 'Priya Anand', status: 'Available' },
  { id: 4, title: 'The Long Ledger', author: 'Wesley Okafor', status: 'Reserved' },
  { id: 5, title: 'Midnight in Kyoto', author: 'Emi Sato', status: 'Available' },
  { id: 6, title: 'Root & Branch', author: 'Callum Ward', status: 'Checked Out' },
]

function Home() {
  const [query, setQuery] = useState('')

  const filteredBooks = initialBooks.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()),
  )

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

      <section className="catalog">
        <div className="catalog-header">
          <h2>Book Catalog</h2>
          <input
            type="search"
            placeholder="Search by title or author..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search the book catalog"
          />
        </div>

        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
              <span className={`status status-${book.status.replace(/\s/g, '')}`}>
                {book.status}
              </span>
            </div>
          ))}
          {filteredBooks.length === 0 && <p>No books match your search.</p>}
        </div>
      </section>
    </div>
  )
}

export default Home
