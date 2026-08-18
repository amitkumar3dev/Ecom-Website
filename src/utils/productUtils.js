export const normalizeProduct = (product = {}) => ({
  ...product,
  image: product.image ?? product.images?.[0] ?? '',
  images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : [],
  category: typeof product.category === 'string' ? product.category : product.category?.name ?? 'Uncategorized',
});
