import { createSlice } from '@reduxjs/toolkit';

const getSavedSession = () => {
  try {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');

    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
    };
  } catch (error) {
    console.error('Could not load auth session from localStorage', error);
    return { user: null, token: null };
  }
};

const { user: savedUser, token: savedToken } = getSavedSession();

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken && !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', token);
    },

    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    },
  },
});

export const { signup, login, logout } = authSlice.actions;

export default authSlice.reducer;