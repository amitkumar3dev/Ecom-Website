import './CategoryFilter.css'  ;

import {
    FaGem,
    FaMale,
    FaFemale,
    FaLaptop,
    FaThLarge
} from 'react-icons/fa';

const categoryIcons = {
    "men's clothing": <FaMale />,
    "women's clothing": <FaFemale />,
    "jewelery": <FaGem />,
    "electronics": <FaLaptop />,
    "all": <FaThLarge />
};

export default function CategoryFilter({ products, selectedCategory, setSelectedCategory }) {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    return (
        <>
            <div className="category-filter">
                {categories.map(category => (
                    <button key={category}
                        className={selectedCategory === category
                            ? 'category-btn active' : 'category-btn'}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {categoryIcons[category]}
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </>
    )
}