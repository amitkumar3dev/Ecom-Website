import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './header.css';
import { useDebounce } from 'use-debounce';

export default function Header({ searchInput, setSearchInput, handleSearch, handleClearSearch, onCartToggle, onWishlistToggle }) {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [debouncedSearchInput] = useDebounce(searchInput, 500);


  useEffect(() => {
    if (debouncedSearchInput.trim()) {
      handleSearch(debouncedSearchInput);
    } else {
      handleClearSearch();
    }
  }, [debouncedSearchInput, handleSearch, handleClearSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="header-link">
          <img className="logo" src="images/logo.png" alt="Store logo" />
          <p className='logo-text'>Dummy Ecom Website</p>
        </div>
      </div>

      <form className="middle-section" onSubmit={handleSubmit}>
        <input className="search-bar" type="text" placeholder="Search" value={searchInput} onChange={handleInputChange} />

        <button className="search-button" type="submit" aria-label="Search products">
          <img className="search-icon" src="images/search-icon.png" alt="Search" />
        </button>
      </form>

      <div className="right-section">
        <button type="button" className="orders-link" aria-label="Wishlist" onClick={onWishlistToggle}>
          <img className="wishlist-icon" src="images/wishlist-icon.png" alt="Wishlist" />
          <div className="orders-text">Wishlist</div>
          {wishlistItems.length > 0 && <span className="wishlist-badge">{wishlistItems.length}</span>}
        </button>

        <button type="button" className="cart-link" aria-label="Open cart" onClick={onCartToggle}>
          <img className="cart-icon" src="images/cart-icon.png" alt="Cart" />
          <div className="cart-text">Cart</div>
          {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
        </button>
      </div>
    </header>
  );
}