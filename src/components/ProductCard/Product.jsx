import { useDispatch, useSelector } from 'react-redux';
import './Product.css';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlistItem } from '../../store/wishlistSlice';

export default function Product({ product, onProductClick, onToast }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isSaved = wishlistItems.some((item) => item.id === product.id);
  const productImage = product.image ?? product.images?.[0] ?? '';

  const handleAddToCart = (event) => {
    event.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    onToast?.('Product added to cart', 'success');
  };

  const handleWishlistToggle = (event) => {
    event.stopPropagation();
    dispatch(toggleWishlistItem(product));
    onToast?.(isSaved ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
  };

  return (
    <div className="product-container" onClick={() => onProductClick(product)}>
      <button className="wishlist-button" type="button" onClick={handleWishlistToggle} aria-label="Toggle wishlist">
        {isSaved ? '♥' : '♡'}
      </button>

      <div className="product-image-container">
        <img className="product-image" src={productImage} alt={product.title} />
      </div>

      <div className="product-name">
        {product.title}
      </div>

      <div className="product-price">
        {`₹ ${product.price}`}
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart} type="button">
        Add to Cart
      </button>
    </div>
  );
}