import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Books.css'

function useAuthorOptions() {
  const [authors, setAuthors] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('authors')
      .select('id, name')
      .order('name', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError) setError(fetchError.message)
        else setAuthors(data ?? [])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { authors, error }
}

function useBookList(refreshKey) {
  const [books, setBooks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    supabase
      .from('books')
      .select('id, name, price, author_id, authors(name)')
      .order('id', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError) setError(fetchError.message)
        else setBooks(data ?? [])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return { books, error, loading }
}

function BookForm({
  authors,
  authorsError,
  name,
  price,
  authorId,
  onNameChange,
  onPriceChange,
  onAuthorChange,
  onSubmit,
  submitting,
  error,
  success,
  submitLabel,
}) {
  return (
    <>
      {authorsError && (
        <p className="books-error">Couldn't load authors: {authorsError}</p>
      )}

      <form className="book-form" onSubmit={onSubmit}>
        <label className="book-field">
          Book name
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g. The Great Gatsby"
          />
        </label>

        <label className="book-field">
          Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => onPriceChange(event.target.value)}
            placeholder="e.g. 12.99"
          />
        </label>

        <label className="book-field">
          Author
          <select
            value={authorId}
            onChange={(event) => onAuthorChange(event.target.value)}
          >
            <option value="" disabled>
              Select an author
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="books-error">{error}</p>}
        {success && <p className="books-success">{success}</p>}

        <button type="submit" className="book-submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </>
  )
}

function Books() {
  const { authors, error: authorsError } = useAuthorOptions()
  const [refreshKey, setRefreshKey] = useState(0)
  const { books, error: booksError, loading: booksLoading } = useBookList(refreshKey)

  // Add-book modal
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const openForm = () => {
    setSubmitError(null)
    setSubmitted(false)
    setName('')
    setPrice('')
    setAuthorId('')
    setIsFormOpen(true)
  }

  const closeForm = () => setIsFormOpen(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitted(false)

    if (!name.trim() || !price || !authorId) {
      setSubmitError('Please fill in book name, price, and author.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('books').insert({
      name: name.trim(),
      price: Number(price),
      author_id: authorId,
    })
    setSubmitting(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    setSubmitted(true)
    setName('')
    setPrice('')
    setAuthorId('')
    setRefreshKey((key) => key + 1)
  }

  // Edit-book modal
  const [editingBook, setEditingBook] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editAuthorId, setEditAuthorId] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState(null)
  const [editSuccess, setEditSuccess] = useState(false)
  const [pendingEdit, setPendingEdit] = useState(null)

  const openEditForm = (book) => {
    setEditingBook(book)
    setEditName(book.name)
    setEditPrice(String(book.price))
    setEditAuthorId(String(book.author_id))
    setEditError(null)
    setEditSuccess(false)
    setPendingEdit(null)
  }

  const closeEditForm = () => {
    setEditingBook(null)
    setPendingEdit(null)
  }

  const handleEditSubmit = (event) => {
    event.preventDefault()
    setEditError(null)
    setEditSuccess(false)

    if (!editName.trim() || !editPrice || !editAuthorId) {
      setEditError('Please fill in book name, price, and author.')
      return
    }

    setPendingEdit({
      name: editName.trim(),
      price: Number(editPrice),
      author_id: editAuthorId,
    })
  }

  const confirmEdit = async () => {
    if (!pendingEdit || !editingBook) return

    setEditSubmitting(true)
    const { error } = await supabase
      .from('books')
      .update(pendingEdit)
      .eq('id', editingBook.id)
    setEditSubmitting(false)
    setPendingEdit(null)

    if (error) {
      setEditError(error.message)
      return
    }

    setEditSuccess(true)
    setRefreshKey((key) => key + 1)
  }

  // Delete-book confirmation
  const [deletingBook, setDeletingBook] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const openDeleteConfirm = (book) => {
    setDeletingBook(book)
    setDeleteError(null)
  }

  const closeDeleteConfirm = () => {
    setDeletingBook(null)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!deletingBook) return

    setIsDeleting(true)
    const { error } = await supabase.from('books').delete().eq('id', deletingBook.id)
    setIsDeleting(false)

    if (error) {
      setDeleteError(error.message)
      return
    }

    setDeletingBook(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="page books">
      <div className="books-header">
        <div>
          <h1>Books</h1>
          <p className="books-intro">Browse the catalog or add a new book.</p>
        </div>
        <button type="button" className="add-book-trigger" onClick={openForm}>
          + Add Book
        </button>
      </div>

      <section className="books-catalog">
        {booksError && (
          <p className="books-error">Couldn't load books: {booksError}</p>
        )}
        {!booksError && !booksLoading && books.length === 0 && (
          <p className="books-empty">No books added yet.</p>
        )}
        <div className="book-grid">
          {books.map((book) => (
            <div className="book-tile" key={book.id}>
              <div className="book-tile-actions">
                <button
                  type="button"
                  className="book-edit-trigger"
                  aria-label={`Edit ${book.name}`}
                  title="Edit"
                  onClick={() => openEditForm(book)}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="book-delete-trigger"
                  aria-label={`Delete ${book.name}`}
                  title="Delete"
                  onClick={() => openDeleteConfirm(book)}
                >
                  🗑️
                </button>
              </div>
              <span className="book-icon">📗</span>
              <h3>{book.name}</h3>
              <p className="book-price">${Number(book.price).toFixed(2)}</p>
              {book.authors?.name && (
                <p className="book-author">{book.authors.name}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {isFormOpen && (
        <div className="book-modal-overlay" onClick={closeForm}>
          <div className="book-modal" onClick={(event) => event.stopPropagation()}>
            <div className="book-modal-header">
              <h2>Add a Book</h2>
              <button
                type="button"
                className="book-modal-close"
                aria-label="Close"
                onClick={closeForm}
              >
                &times;
              </button>
            </div>
            <p className="books-intro">
              Choose the author from the list fetched from the database.
            </p>

            <BookForm
              authors={authors}
              authorsError={authorsError}
              name={name}
              price={price}
              authorId={authorId}
              onNameChange={setName}
              onPriceChange={setPrice}
              onAuthorChange={setAuthorId}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={submitError}
              success={submitted ? 'Book added successfully.' : null}
              submitLabel="Add Book"
            />
          </div>
        </div>
      )}

      {editingBook && (
        <div className="book-modal-overlay" onClick={closeEditForm}>
          <div className="book-modal" onClick={(event) => event.stopPropagation()}>
            <div className="book-modal-header">
              <h2>Edit Book</h2>
              <button
                type="button"
                className="book-modal-close"
                aria-label="Close"
                onClick={closeEditForm}
              >
                &times;
              </button>
            </div>
            <p className="books-intro">Update the details, then save.</p>

            <BookForm
              authors={authors}
              authorsError={authorsError}
              name={editName}
              price={editPrice}
              authorId={editAuthorId}
              onNameChange={setEditName}
              onPriceChange={setEditPrice}
              onAuthorChange={setEditAuthorId}
              onSubmit={handleEditSubmit}
              submitting={editSubmitting}
              error={editError}
              success={editSuccess ? 'Book updated successfully.' : null}
              submitLabel="Save Changes"
            />

            {pendingEdit && (
              <div className="confirm-inline">
                <p>Save these changes to the database?</p>
                <div className="confirm-inline-actions">
                  <button
                    type="button"
                    className="confirm-cancel"
                    onClick={() => setPendingEdit(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="confirm-yes"
                    onClick={confirmEdit}
                    disabled={editSubmitting}
                  >
                    {editSubmitting ? 'Saving...' : 'Yes, save changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {deletingBook && (
        <div className="book-modal-overlay" onClick={closeDeleteConfirm}>
          <div
            className="book-modal confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Delete this book?</h2>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deletingBook.name}</strong>? Your record will be
              permanently deleted.
            </p>

            {deleteError && <p className="books-error">{deleteError}</p>}

            <div className="confirm-inline-actions">
              <button
                type="button"
                className="confirm-cancel"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Books
