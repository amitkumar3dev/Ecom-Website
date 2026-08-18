import { useEffect, useState } from "react";
import "../ProductModal/ProductModal.css";
import "./ProductForm.css";
import adminApi from "../../services/adminApi";

export default function ProductForm({
  initialProduct,
  categories,
  onClose,
  onSuccess,
}) {
  const isEditMode = Boolean(initialProduct);

  const [title, setTitle] = useState(initialProduct?.title ?? "");
  const [price, setPrice] = useState(initialProduct?.price ?? "");
  const [description, setDescription] = useState(
    initialProduct?.description ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category?.id ?? categories?.[0]?.id ?? "",
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialProduct?.images?.[0] ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleImageChange = (event) => {
    console.log("Event:", event);
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    console.log(file);

    //creates blob objects --- url which is then displayed on img tag
    const previewUrl = URL.createObjectURL(file);
    console.log(previewUrl);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !price || !categoryId) {
      setError("Title, price and category are required.");
      return;
    }
    if (!isEditMode && !imageFile) {
      setError("Please select an image.");
      return;
    }

    setSubmitting(true);
    try {
      let images = initialProduct?.images ?? [];
      if (imageFile) {
        const uploaded = await adminApi.uploadFile(imageFile);
        images = [uploaded.location];
      }

      const payload = {
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
        categoryId: Number(categoryId),
        images,
      };

      const result = isEditMode
        ? await adminApi.updateProduct(initialProduct.id, payload)
        : await adminApi.createProduct(payload);

      onSuccess?.(result, isEditMode ? "update" : "create");
      onClose?.();
    } catch (err) {
      console.error("Product save failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-modal" onClick={onClose}>
      <div
        className="product-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" type="button" onClick={onClose}>
          ✕
        </button>

        <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>

        <form className="product-form" onSubmit={handleSubmit}>
          {imagePreview && (
            <img
              className="modal-product-image"
              src={imagePreview}
              alt="Preview"
            />
          )}

          <label className="product-form-label">
            Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <label className="product-form-label">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
            />
          </label>

          <label className="product-form-label">
            Price
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </label>

          <label className="product-form-label">
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="product-form-label">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </label>

          {error && <p className="product-form-error">{error}</p>}

          <button
            className="add-to-cart-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
