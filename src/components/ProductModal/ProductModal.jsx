import { useDispatch, useSelector } from "react-redux";
import "./ProductModal.css";
import { addToCart } from "../../store/cartSlice";
import { toggleWishlistItem } from "../../store/wishlistSlice";

export default function ProductModal({
  selectedProduct,
  setSelectedProduct,
  onToast,
}) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isSaved = wishlistItems.some((item) => item.id === selectedProduct?.id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product: selectedProduct, quantity: 1 }));
    onToast?.("Product added to cart", "success");
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlistItem(selectedProduct));
    onToast?.(isSaved ? "Removed from wishlist" : "Saved to wishlist", "info");
  };

    return (
        <div className="product-modal" onClick={() => setSelectedProduct(null)}>
            <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" type="button" onClick={() => setSelectedProduct(null)}>✕</button>
                <button className="modal-wishlist-button" type="button" onClick={handleWishlistToggle} aria-label="Toggle wishlist">
                    {isSaved ? '♥ Saved' : '♡ Save'}
                </button>
                <img className="modal-product-image" src={selectedProduct?.image ?? selectedProduct?.images?.[0]} alt={selectedProduct?.title} />
                <h2>{selectedProduct?.title}</h2>
                <p className="modal-price"> ₹ {selectedProduct?.price}</p>
                <p className="modal-description"> {selectedProduct?.description}</p>
                <p className="modal-category"> Category: {selectedProduct?.category ?? 'N/A'}</p>
                <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
}
