import './CategoryFilter.css';

import {
    FaThLarge
} from 'react-icons/fa';

const categoryIcons = {
    Clothes: <img src="https://i.imgur.com/QkIa5tT.jpeg" alt="Clothes" className="category-icon" />,
    Electronics: <img src="https://i.imgur.com/ZANVnHE.jpeg" alt="Electronics" className="category-icon" />,
    Furniture: <img src="https://i.imgur.com/Qphac99.jpeg" alt="Furniture" className="category-icon" />,
    Shoes: <img src="https://i.imgur.com/qNOjJje.jpeg" alt="Shoes" className="category-icon" />,
    Miscellaneous: <img src="https://i.imgur.com/BG8J0Fj.jpg" alt="Miscellaneous" className="category-icon" />,
    all: <FaThLarge className="category-icon" />
};

export default function CategoryFilter({ products, selectedCategory, setSelectedCategory }) {
    const categories = [
        'all',
        ...new Set(
            products
                .map((product) => product.category?.name ?? product.category)
                .filter(Boolean)
        )
    ];

    return (
        <>
            <div className="category-filter">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {categoryIcons[category] ?? <FaThLarge className="category-icon" />}
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </>
    );
}