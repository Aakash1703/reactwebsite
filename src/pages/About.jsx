import './About.css'

function About() {
  return (
    <div className="page about">
      <h1>About CityLibrary</h1>
      <p>
        CityLibrary is a community library management system that helps
        librarians and members keep track of books, availability, and
        reservations in one simple dashboard.
      </p>

      <div className="about-grid">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Make books easy to find and easy to share, for every member of
            the community, regardless of background or experience with
            technology.
          </p>
        </div>
        <div className="about-card">
          <h2>What We Offer</h2>
          <ul>
            <li>A searchable catalog of available titles</li>
            <li>Live status on checked-out and reserved books</li>
            <li>A simple way to reach the library team</li>
          </ul>
        </div>
        <div className="about-card">
          <h2>Opening Hours</h2>
          <ul className="hours">
            <li><span>Monday – Friday</span><span>9:00 AM – 8:00 PM</span></li>
            <li><span>Saturday</span><span>10:00 AM – 5:00 PM</span></li>
            <li><span>Sunday</span><span>Closed</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
