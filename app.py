"""
CityLibrary - single-file Python version of the library management site.

Contains the HTML, CSS, and React (JSX) code all inline as strings and
serves them with Python's built-in http.server - no Node.js, npm, or
build step required to run it.

React/ReactDOM/Babel are loaded from a CDN in the browser (so an internet
connection is needed when *viewing* the page), and Babel compiles the JSX
on the fly client-side.

Run with:
    python app.py
Then open:
    http://localhost:8000
"""

import json
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000

HERO_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-labelledby="libTitle">
  <title id="libTitle">Illustration of a library bookshelf</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#e0e7ff"/>
    </linearGradient>
    <linearGradient id="woodShelf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a9673a"/>
      <stop offset="100%" stop-color="#8a4f28"/>
    </linearGradient>
  </defs>
  <rect width="640" height="420" rx="16" fill="url(#bg)"/>
  <rect x="40" y="40" width="560" height="330" fill="#6b4226" rx="6"/>
  <rect x="56" y="56" width="528" height="298" fill="#f5ede1" rx="4"/>
  <g>
    <rect x="56" y="120" width="528" height="14" fill="url(#woodShelf)"/>
    <rect x="56" y="220" width="528" height="14" fill="url(#woodShelf)"/>
    <rect x="56" y="320" width="528" height="14" fill="url(#woodShelf)"/>
  </g>
  <g>
    <rect x="70" y="70" width="18" height="50" fill="#e76f51"/>
    <rect x="90" y="60" width="16" height="60" fill="#2a9d8f"/>
    <rect x="108" y="72" width="20" height="48" fill="#e9c46a"/>
    <rect x="130" y="65" width="14" height="55" fill="#264653"/>
    <rect x="146" y="75" width="18" height="45" fill="#f4a261"/>
    <rect x="166" y="62" width="16" height="58" fill="#8ab17d"/>
    <rect x="184" y="70" width="20" height="50" fill="#e76f51"/>
    <rect x="206" y="66" width="14" height="54" fill="#457b9d"/>
    <rect x="222" y="74" width="18" height="46" fill="#e9c46a"/>
    <rect x="330" y="68" width="16" height="52" fill="#457b9d"/>
    <rect x="348" y="60" width="20" height="60" fill="#e76f51"/>
    <rect x="370" y="72" width="14" height="48" fill="#2a9d8f"/>
    <rect x="386" y="64" width="18" height="56" fill="#e9c46a"/>
    <rect x="406" y="74" width="16" height="46" fill="#8ab17d"/>
    <rect x="424" y="66" width="20" height="54" fill="#f4a261"/>
    <rect x="446" y="72" width="14" height="48" fill="#264653"/>
    <rect x="462" y="63" width="18" height="57" fill="#e76f51"/>
  </g>
  <g>
    <rect x="70" y="168" width="16" height="52" fill="#264653"/>
    <rect x="88" y="160" width="20" height="60" fill="#f4a261"/>
    <rect x="110" y="170" width="14" height="50" fill="#2a9d8f"/>
    <rect x="126" y="162" width="18" height="58" fill="#e9c46a"/>
    <rect x="146" y="172" width="16" height="48" fill="#e76f51"/>
    <rect x="164" y="164" width="20" height="56" fill="#457b9d"/>
    <rect x="360" y="166" width="18" height="54" fill="#8ab17d"/>
    <rect x="380" y="160" width="14" height="60" fill="#e76f51"/>
    <rect x="396" y="170" width="20" height="50" fill="#264653"/>
    <rect x="418" y="163" width="16" height="57" fill="#e9c46a"/>
    <rect x="436" y="172" width="18" height="48" fill="#457b9d"/>
    <rect x="456" y="165" width="14" height="55" fill="#f4a261"/>
  </g>
  <g>
    <rect x="70" y="266" width="20" height="54" fill="#e9c46a"/>
    <rect x="92" y="260" width="14" height="60" fill="#264653"/>
    <rect x="108" y="270" width="18" height="50" fill="#457b9d"/>
    <rect x="128" y="262" width="16" height="58" fill="#e76f51"/>
    <rect x="146" y="272" width="20" height="48" fill="#8ab17d"/>
    <rect x="400" y="264" width="16" height="56" fill="#e76f51"/>
    <rect x="418" y="258" width="20" height="62" fill="#457b9d"/>
    <rect x="440" y="270" width="14" height="50" fill="#e9c46a"/>
    <rect x="456" y="262" width="18" height="58" fill="#264653"/>
    <rect x="476" y="272" width="16" height="48" fill="#f4a261"/>
  </g>
  <g transform="translate(250,150)">
    <path d="M0 20 Q40 0 80 20 L80 55 Q40 40 0 55 Z" fill="#ffffff" stroke="#264653" stroke-width="2"/>
    <path d="M80 20 Q120 0 160 20 L160 55 Q120 40 80 55 Z" fill="#ffffff" stroke="#264653" stroke-width="2"/>
    <line x1="80" y1="20" x2="80" y2="55" stroke="#264653" stroke-width="2"/>
  </g>
  <g transform="translate(500,255)">
    <rect x="0" y="30" width="34" height="24" rx="3" fill="#9c6644"/>
    <circle cx="17" cy="10" r="18" fill="#57a773"/>
    <circle cx="4" cy="20" r="12" fill="#57a773"/>
    <circle cx="30" cy="20" r="12" fill="#57a773"/>
  </g>
  <rect x="0" y="392" width="640" height="28" fill="#c8b6a6"/>
</svg>"""

CSS = """
* { box-sizing: border-box; }
body { margin: 0; font: 17px/150% system-ui, "Segoe UI", Roboto, sans-serif; color: #333; }
#root { min-height: 100vh; display: flex; flex-direction: column; }
#root main { flex: 1; }
h1, h2, h3 { color: #1b1b1b; }
p { margin: 0; }

.navbar { background: #264653; color: #fff; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.navbar-inner { max-width: 1100px; margin: 0 auto; padding: 0.9rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
.brand { font-size: 1.25rem; font-weight: 700; color: #fff; text-decoration: none; }
.nav-toggle { display: none; flex-direction: column; justify-content: space-between; width: 26px; height: 20px; background: none; border: none; cursor: pointer; padding: 0; }
.nav-toggle-bar { display: block; height: 3px; width: 100%; background: #fff; border-radius: 2px; }
.nav-links { display: flex; gap: 1.75rem; }
.nav-links a { color: #e9ecef; text-decoration: none; font-weight: 500; padding: 0.4rem 0.2rem; border-bottom: 2px solid transparent; cursor: pointer; }
.nav-links a:hover { color: #fff; }
.nav-links a.active { color: #fff; border-bottom-color: #e9c46a; }

@media (max-width: 720px) {
  .nav-toggle { display: flex; }
  .nav-links { position: absolute; top: 100%; left: 0; right: 0; background: #264653; flex-direction: column; gap: 0; max-height: 0; overflow: hidden; transition: max-height 0.25s ease; }
  .nav-links.open { max-height: 240px; }
  .nav-links a { padding: 0.9rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
}

.page { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem; }
.page h1 { color: #264653; margin-bottom: 1rem; }

.hero { display: flex; align-items: center; gap: 2.5rem; padding: 3rem 1.5rem; max-width: 1100px; margin: 0 auto; }
.hero-text { flex: 1; min-width: 260px; }
.hero-text h1 { font-size: 2.4rem; margin-bottom: 0.75rem; color: #264653; }
.hero-text p { font-size: 1.1rem; color: #4a4a4a; max-width: 42ch; }
.hero-image { flex: 1; max-width: 420px; width: 100%; }
.hero-image svg { width: 100%; height: auto; }

.catalog { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
.catalog-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.catalog-header h2 { color: #264653; }
.catalog-header input { padding: 0.55rem 0.9rem; border: 1px solid #ccc; border-radius: 6px; min-width: 240px; font-size: 1rem; }
.book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
.book-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 1.1rem 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.book-card h3 { margin: 0 0 0.35rem; color: #264653; font-size: 1.05rem; }
.book-card .author { color: #666; margin: 0 0 0.75rem; font-size: 0.95rem; }
.status { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
.status-Available { background: #d8f3dc; color: #1b4332; }
.status-CheckedOut { background: #ffe5d9; color: #9d0208; }
.status-Reserved { background: #fff3b0; color: #7f5539; }

@media (max-width: 720px) {
  .hero { flex-direction: column; text-align: center; padding: 2rem 1.25rem; }
  .hero-text p { max-width: none; }
}

.about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 1.75rem; }
.about-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.about-card h2 { color: #264653; font-size: 1.15rem; margin-top: 0; }
.about-card ul { padding-left: 1.1rem; margin: 0; }
.about-card .hours { list-style: none; padding: 0; }
.about-card .hours li { display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid #f0f0f0; }
.about-card .hours li:last-child { border-bottom: none; }

.success-banner { background: #d8f3dc; color: #1b4332; padding: 0.75rem 1rem; border-radius: 8px; margin: 1rem 0; }
.contact-form { display: flex; flex-direction: column; max-width: 480px; margin-top: 1.5rem; }
.contact-form label { font-weight: 600; color: #264653; margin-bottom: 0.35rem; margin-top: 1rem; }
.contact-form label:first-of-type { margin-top: 0; }
.contact-form input, .contact-form textarea { padding: 0.6rem 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; font-family: inherit; }
.contact-form button { margin-top: 1.5rem; align-self: flex-start; background: #264653; color: #fff; border: none; padding: 0.7rem 1.4rem; border-radius: 6px; font-size: 1rem; cursor: pointer; }
.contact-form button:hover { background: #1d3540; }

.site-footer { background: #264653; color: #e9ecef; text-align: center; padding: 1.1rem 1.5rem; font-size: 0.9rem; }
"""

APP_JSX_TEMPLATE = """
const { useState } = React;

function Navbar({ page, setPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const go = (p) => { setPage(p); setIsOpen(false); };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); go('home'); }}>
          \U0001F4DA CityLibrary
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
        </button>

        <nav className={"nav-links" + (isOpen ? " open" : "")}>
          <a href="#" className={page === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); go('home'); }}>Home</a>
          <a href="#" className={page === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); go('about'); }}>About</a>
          <a href="#" className={page === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); go('contact'); }}>Contact</a>
        </nav>
      </div>
    </header>
  );
}

const initialBooks = [
  { id: 1, title: 'The Silent Ocean', author: 'Mara Lindqvist', status: 'Available' },
  { id: 2, title: 'Atoms & Empires', author: 'D. R. Faulkner', status: 'Checked Out' },
  { id: 3, title: 'Gardens of Rust', author: 'Priya Anand', status: 'Available' },
  { id: 4, title: 'The Long Ledger', author: 'Wesley Okafor', status: 'Reserved' },
  { id: 5, title: 'Midnight in Kyoto', author: 'Emi Sato', status: 'Available' },
  { id: 6, title: 'Root & Branch', author: 'Callum Ward', status: 'Checked Out' },
];

function Home() {
  const [query, setQuery] = useState('');
  const filteredBooks = initialBooks.filter((book) =>
    (book.title + ' ' + book.author).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to CityLibrary</h1>
          <p>Browse the catalog, check book availability, and manage your reading list, all in one place.</p>
        </div>
        <div className="hero-image" dangerouslySetInnerHTML={{ __html: __HERO_SVG_JSON__ }} />
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
              <span className={"status status-" + book.status.replace(/\\s/g, '')}>{book.status}</span>
            </div>
          ))}
          {filteredBooks.length === 0 && <p>No books match your search.</p>}
        </div>
      </section>
    </div>
  );
}

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
          <p>Make books easy to find and easy to share, for every member of the community, regardless of background or experience with technology.</p>
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
            <li><span>Monday - Friday</span><span>9:00 AM - 8:00 PM</span></li>
            <li><span>Saturday</span><span>10:00 AM - 5:00 PM</span></li>
            <li><span>Sunday</span><span>Closed</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const initialForm = { name: '', email: '', message: '' };
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="page contact">
      <h1>Contact the Library</h1>
      <p>Have a question about a book, a reservation, or your account? Send us a message and the library team will get back to you.</p>

      {submitted && (
        <div className="success-banner" role="status">Thanks! Your message has been received.</div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange} />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  return (
    <>
      <Navbar page={page} setPage={setPage} />
      <main>
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} CityLibrary. All rights reserved.</p>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
"""

APP_JSX = APP_JSX_TEMPLATE.replace("__HERO_SVG_JSON__", json.dumps(HERO_SVG))

HTML_PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CityLibrary - Library Management</title>
<style>
{css}
</style>
</head>
<body>
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
{jsx}
</script>
</body>
</html>
""".format(css=CSS, jsx=APP_JSX).encode("utf-8")


class LibraryRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(HTML_PAGE)))
        self.end_headers()
        self.wfile.write(HTML_PAGE)

    def log_message(self, format, *args):
        pass


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), LibraryRequestHandler)
    url = "http://localhost:{}".format(PORT)
    print("Serving CityLibrary at {}".format(url))
    print("Press Ctrl+C to stop.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
