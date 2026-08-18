import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const token = loginResponse.data.access_token;

      const profileResponse = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userFromApi = profileResponse.data;
      const userData = {
        id: userFromApi.id,
        name: userFromApi.name,
        email: userFromApi.email,
        avatar: userFromApi.avatar,
        role: userFromApi.role?.name ?? userFromApi.role ?? 'Customer',
      };

      dispatch(login({ user: userData, token }));
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button
        type="button"
        className="auth-close-button"
        aria-label="Go back to homepage"
        onClick={() => navigate('/')}
      >
        ✕
      </button>

      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p onClick={() => navigate('/signup')}>
          New user? Create account
        </p>
      </form>
    </div>
  );
}