import { useState } from 'react'

// Labelled password field with a Show / Hide toggle.
function PasswordInput({ id, name, label, value, onChange, autoComplete, placeholder }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className='auth-field'>
      <label htmlFor={id}>{label}</label>
      <div className='auth-field__row'>
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
        />
        <button
          type='button'
          className='auth-field__toggle'
          onClick={() => setVisible(!visible)}
          aria-pressed={visible}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
