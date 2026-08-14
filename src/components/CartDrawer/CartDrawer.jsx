import { useDispatch, useSelector } from 'react-redux';
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../store/cartSlice';
import './CartDrawer.css';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const SHIPPING_THRESHOLD = 1500;
const SHIPPING_CHARGE = 90;

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const shipping = cartItems.length === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-drawer-header">
          <div>
            <p className="cart-title">Your cart</p>
            <p className="cart-summary">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
          </div>
          <button type="button" className="close-cart-button" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button type="button" className="continue-shopping" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-item-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-image" />

                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.title}</p>
                    <p className="cart-item-price">{currencyFormatter.format(item.price)}</p>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button type="button" onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                      </div>

                      <button type="button" className="remove-item-button" onClick={() => dispatch(removeFromCart(item.id))}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-panel">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{currencyFormatter.format(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>{shipping === 0 ? 'Free' : currencyFormatter.format(shipping)}</strong>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <strong>{currencyFormatter.format(tax)}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <strong>{currencyFormatter.format(total)}</strong>
              </div>

              <button type="button" className="checkout-button">Checkout</button>
              <button type="button" className="clear-cart-button" onClick={() => dispatch(clearCart())}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
