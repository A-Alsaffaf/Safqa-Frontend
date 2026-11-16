import { useEffect, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../services/categoryService'

// Admin tab: every category with Add, Rename and Delete. The backend also checks the Admin role.
function AccountCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [newName, setNewName] = useState('')
  // Only one row can be renamed or deleted at a time
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      try {
        const data = await getCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        console.log(err)
        if (!cancelled) setError(err.response?.data?.message || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCategories()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleAdd(event) {
    event.preventDefault()
    const name = newName.trim()
    if (!name) {
      setError('Enter a category name')
      return
    }

    setBusy(true)
    setError('')

    try {
      const created = await createCategory(name)
      setCategories([...categories, created])
      setNewName('')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setBusy(false)
    }
  }

  function startEdit(category) {
    setEditingId(category._id)
    setEditName(category.name)
    setDeletingId(null)
    setError('')
  }

  async function handleSave(event, categoryId) {
    event.preventDefault()
    const name = editName.trim()
    if (!name) {
      setError('Enter a category name')
      return
    }

    setBusy(true)
    setError('')

    try {
      const updated = await updateCategory(categoryId, name)
      setCategories(categories.map((category) => (category._id === categoryId ? updated : category)))
      setEditingId(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(categoryId) {
    setBusy(true)
    setError('')

    try {
      await deleteCategory(categoryId)
      setCategories(categories.filter((category) => category._id !== categoryId))
      setDeletingId(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className='account-panel'>
        <p>Loading ..</p>
      </div>
    )
  }

  let errorLine = null
  if (error) {
    errorLine = <p className='account-error' role='alert'>{error}</p>
  }

  let emptyLine = null
  if (categories.length === 0) {
    emptyLine = <p className='account-empty'>No categories yet. Add the first one above.</p>
  }

  return (
    <>
      {errorLine}

      <form className='account-panel account-form' onSubmit={handleAdd}>
        <label htmlFor='newCategory' className='account-form__label'>New category</label>
        <input
          id='newCategory'
          type='text'
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder='For example: Electronics'
          maxLength={60}
          disabled={busy}
        />
        <button type='submit' className='account-btn account-btn--primary' disabled={busy}>
          Add category
        </button>
      </form>

      <ul className='account-panel account-list'>
        {categories.map((category) => {
          if (editingId === category._id) {
            return (
              <li key={category._id} className='account-row'>
                <form className='account-form account-form--inline' onSubmit={(event) => handleSave(event, category._id)}>
                  <input
                    type='text'
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    aria-label={`New name for ${category.name}`}
                    maxLength={60}
                    autoFocus
                    disabled={busy}
                  />
                  <button type='submit' className='account-btn account-btn--primary' disabled={busy}>
                    Save
                  </button>
                  <button type='button' className='account-btn' disabled={busy} onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </form>
              </li>
            )
          }

          if (deletingId === category._id) {
            return (
              <li key={category._id} className='account-row'>
                <div className='account-row__main'>
                  <span className='account-row__title'>Delete "{category.name}"?</span>
                  <span className='account-row__meta'>Listings in this category keep their category id but it will no longer match a name.</span>
                </div>
                <div className='account-row__actions'>
                  <button type='button' className='account-btn account-btn--danger' disabled={busy} onClick={() => handleDelete(category._id)}>
                    Yes, delete
                  </button>
                  <button type='button' className='account-btn' disabled={busy} onClick={() => setDeletingId(null)}>
                    Cancel
                  </button>
                </div>
              </li>
            )
          }

          return (
            <li key={category._id} className='account-row'>
              <div className='account-row__main'>
                <span className='account-row__title'>{category.name}</span>
              </div>
              <div className='account-row__actions'>
                <button
                  type='button'
                  className='account-btn'
                  disabled={busy}
                  onClick={() => startEdit(category)}
                  aria-label={`Rename ${category.name}`}
                >
                  Rename
                </button>
                <button
                  type='button'
                  className='account-btn'
                  disabled={busy}
                  onClick={() => {
                    setDeletingId(category._id)
                    setEditingId(null)
                    setError('')
                  }}
                  aria-label={`Delete ${category.name}`}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {emptyLine}
    </>
  )
}

export default AccountCategories
