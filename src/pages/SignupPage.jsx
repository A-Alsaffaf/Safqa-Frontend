import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../services/authService";
import AuthCard from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });
  const [ submitting, setSubmitting ] = useState(false)

  const { username, email, password, passwordConf } = formData;

  function handleChange(event){
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });

  }


  async function handleSubmit(event){
    event.preventDefault();
    try {
      setSubmitting(true)
      await signUp(formData);
      navigate('/sign-in')
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to sign up. Please try again.");
      setSubmitting(false)
    }
  }

  function isFormInvalid(){
    return !(username && email && password && password === passwordConf);
  };

  const passwordsMismatch = Boolean(passwordConf) && password !== passwordConf;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Safqa to buy, sell and bid."
      error={error}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="e.g. salma_k"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Create a password"
        />
        {/* The backend rejects passwords shorter than 6 characters */}
        <p className="auth-field__help">Minimum 6 characters.</p>

        <PasswordInput
          id="confirm"
          name="passwordConf"
          label="Confirm password"
          value={passwordConf}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Repeat the password"
        />
        {passwordsMismatch ? (
          <p className="auth-field__hint">Passwords do not match.</p>
        ) : null}

        <button type="submit" className="auth-form__submit" disabled={isFormInvalid() || submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
export default Signup;
