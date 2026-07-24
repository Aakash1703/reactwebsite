import aboutImage from '../assets/about.png'
import './About.css'

function About() {
  return (
    <div className="page about">
      <h1>About</h1>
      <img className="about-image" src={aboutImage} alt="Open book illustration" />
      <p>
        CityLibrary is a simple catalog and availability tracker for the
        community library.
      </p>
    </div>
  )
}

export default About
