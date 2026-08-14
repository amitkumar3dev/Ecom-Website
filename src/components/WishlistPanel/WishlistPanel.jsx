import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../../store/wishlistSlice';
import './WishlistPanel.css';

export default function WishlistPanel({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <aside className="wishlist-panel" onClick={(event) => event.stopPropagation()}>
        <div className="wishlist-panel-header">
          <div>
            <p className="wishlist-title">Saved items</p>
            <p className="wishlist-summary">{wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'}</p>
          </div>
          <button type="button" className="close-wishlist-button" onClick={onClose} aria-label="Close wishlist">
            ✕
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty.</p>
            <button type="button" className="continue-shopping" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <div className="wishlist-item-list">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img src={item.image} alt={item.title} className="wishlist-item-image" />

                <div className="wishlist-item-details">
                  <p className="wishlist-item-name">{item.title}</p>
                  <p className="wishlist-item-price">₹ {item.price}</p>
                  <p className="wishlist-item-category">{item.category}</p>
                  <button
                    type="button"
                    className="remove-from-wishlist-button"
                    onClick={() => dispatch(toggleWishlistItem(item))}
                  >
                    Remove from wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
