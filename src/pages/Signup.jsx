import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signup } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatarPreview('');
      setFormData((prev) => ({ ...prev, avatar: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setAvatarPreview(result);
      setFormData((prev) => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedEmail || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const createResponse = await axios.post('https://api.escuelajs.co/api/v1/users', {
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
        avatar: formData.avatar || 'https://picsum.photos/800',
      });

      const createdUser = createResponse.data;

      const loginResponse = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
        email: trimmedEmail,
        password: formData.password,
      });

      const token = loginResponse.data.access_token;

      const profileResponse = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userFromApi = profileResponse.data || createdUser;
      const userData = {
        id: userFromApi.id,
        name: userFromApi.name,
        email: userFromApi.email,
        avatar: userFromApi.avatar,
        role: userFromApi.role?.name ?? userFromApi.role ?? 'Customer',
      };

      dispatch(signup({ user: userData, token }));
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Unable to create account. Please check the details and try again.');
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

      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        {error && <p className="auth-error">{error}</p>}

        <div className="avatar-upload-box">
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="avatar-preview" />
            ) : (
              <span className="avatar-upload-placeholder">Upload photo</span>
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p onClick={() => navigate('/login')}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}