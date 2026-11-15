import { useState } from 'react';
import { useNavigate } from 'react-router';

import { signIn } from '../services/authService';
import AuthCard from '../components/AuthCard';
import PasswordInput from '../components/PasswordInput';


const SignInForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function handleChange(event){
    setError('');
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      setSubmitting(true);
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title='Log in to Safqa' error={error}>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='auth-field'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            autoComplete='username'
            required
          />
        </div>

        <PasswordInput
          id='password'
          name='password'
          label='Password'
          value={formData.password}
          onChange={handleChange}
          autoComplete='current-password'
          placeholder='Your password'
        />

        <button type='submit' className='auth-form__submit' disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthCard>
  );
};

export default SignInForm;
