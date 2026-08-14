import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ecom-wishlist-items';

const loadWishlistItems = () => {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (error) {
    console.error('Could not load wishlist from localStorage', error);
    return [];
  }
};

const initialState = {
  items: loadWishlistItems(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex((savedItem) => savedItem.id === item.id);

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(item);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
