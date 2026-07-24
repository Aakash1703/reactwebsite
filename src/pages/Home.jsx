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

function Home() {
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
    </div>
  )
}

export default Home
