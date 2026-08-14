import './ProductGrid.css';
import Product from '../ProductCard/Product';

export default function ProductsGrid({ products, onProductClick, onToast }) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <Product
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onToast={onToast}
          />
        );
      })}
    </div>
  );
}