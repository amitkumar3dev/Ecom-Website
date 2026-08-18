import { useEffect, useState } from "react";
import ProductForm from "../components/Admin/ProductForm";
import AdminProductList from "../components/Admin/AdminProductList";
import productsApi from "../services/productsApi";
import adminApi from "../services/adminApi";
import "./Admin.css";

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  //fetch categories available to pass to Product form

  //fetch products to display in the admin list (limited to reduce image requests)
  useEffect(() => {
    async function loadCategories() {
      const data = await productsApi.getCategories();
      setCategories(data);
    }

    async function loadProducts() {
      try {
        const data = await productsApi.getAllProducts();
        setProducts(data);
      } catch {
        setProductsError("Failed to load products.");
      } finally {
        setProductsLoading(false);
      }
    }
    loadCategories();
    loadProducts();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = (product, mode) => {
    if (mode === "update") {
      setProducts(
        (prev) => prev.map((p) => (p.id === product.id ? product : p)),
        console.log(product),
        console.log(mode),
      );
    } else {
      setProducts((prev) => [product, ...prev]);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    try {
      await adminApi.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      window.alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin Page</h1>
        <button
          type="button"
          className="admin-add-button"
          onClick={handleAddClick}
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          initialProduct={editingProduct}
          categories={categories}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <AdminProductList
        products={products}
        loading={productsLoading}
        error={productsError}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
    </div>
  );
}
