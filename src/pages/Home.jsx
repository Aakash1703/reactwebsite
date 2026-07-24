import libraryHero from '../assets/lib.png'
import './Home.css'

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
    </div>
  )
}

export default Home
