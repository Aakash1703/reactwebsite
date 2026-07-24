import { useState } from 'react'
import './Contact.css'

const initialForm = { name: '', email: '', message: '' }

function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <div className="page contact">
      <h1>Contact the Library</h1>
      <p>
        Have a question about a book, a reservation, or your account? Send
        us a message and the library team will get back to you.
      </p>

      {submitted && (
        <div className="success-banner" role="status">
          Thanks! Your message has been received.
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          value={form.message}
          onChange={handleChange}
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}

export default Contact
