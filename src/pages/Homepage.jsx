import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

import { normalizeProduct } from '../utils/productUtils';
import Header from '../components/Header/Header';
import ProductsGrid from '../components/ProductsGrid/ProductsGrid';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import ProductModal from '../components/ProductModal/ProductModal';
import CartDrawer from '../components/CartDrawer/CartDrawer';
import WishlistPanel from '../components/WishlistPanel/WishlistPanel';
import Toast from '../components/Toast/Toast';

import './Homepage.css';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const response = await axios.get('https://api.escuelajs.co/api/v1/products');
                const normalizedProducts = response.data.map(normalizeProduct);
                setProducts(normalizedProducts);
            } catch (error) {
                console.error('Unable to load products:', error);
            }
        };

        getHomeData();
    }, []);

    const handleSearch = useCallback((debouncedValue) => {
        setSearchTerm(debouncedValue.trim());
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchInput('');
        setSearchTerm('');
    }, []);

    const displayedProducts = products.filter((product) => {
        const productCategoryName = product.category?.name ?? product.category;
        const matchesCategory =
            selectedCategory === 'all' ||
            productCategoryName === selectedCategory;

        const normalizedSearch = searchTerm.toLowerCase();

        const matchesSearch =
            normalizedSearch === '' ||
            product.title.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        if (selectedProduct || isCartOpen || isWishlistOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedProduct, isCartOpen, isWishlistOpen]);

    useEffect(() => {
        if (!toast.visible) return;

        const timer = setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 1800);

        return () => clearTimeout(timer);
    }, [toast.visible]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });
    };

    return (
        <>
            <Header
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
                onCartToggle={() => setIsCartOpen(true)}
                onWishlistToggle={() => setIsWishlistOpen(true)}
            />

            <CategoryFilter products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <div className="home-page">
                {displayedProducts.length > 0 ? (
                    <ProductsGrid
                        products={displayedProducts}
                        onProductClick={setSelectedProduct}
                        onToast={showToast}
                    />
                ) : (
                    <p className="no-results">
                        No products found
                        {searchTerm && ` for "${searchTerm}"`}
                        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                        .
                    </p>
                )}
            </div>

            {selectedProduct && (
                <ProductModal
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    onToast={showToast}
                />
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onToast={showToast} />
            <WishlistPanel isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} onToast={showToast} />
            <Toast message={toast.message} type={toast.type} isVisible={toast.visible} />
        </>
    );
}