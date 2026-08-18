import "./AdminProductList.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#e4e4e4"/><text x="24" y="28" font-size="10" text-anchor="middle" fill="#999">No image</text></svg>',
  );

export default function AdminProductList({
  products,
  loading,
  error,
  onEdit,
  onDelete,
}) {
  if (loading) return <p className="admin-list-status">Loading products...</p>;
  if (error)
    return <p className="admin-list-status admin-list-error">{error}</p>;
  if (!products.length)
    return <p className="admin-list-status">No products found.</p>;

  return (
    <div className="admin-product-table-wrap">
      <div className="admin-product-table-scroll">
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    className="admin-product-thumb"
                    src={product.images?.[0] || FALLBACK_IMAGE}
                    alt={product.title}
                    // loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </td>
                <td className="admin-product-title">{product.title}</td>
                <td className="admin-product-price">{`₹ ${product.price}`}</td>
                <td>{product.category?.name}</td>
                <td>
                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() => onEdit?.(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-delete"
                      onClick={() => onDelete?.(product)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
