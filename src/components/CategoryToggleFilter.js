import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const Categories = ['ALL', 'APPAREL', 'ELECTRONICS', 'FOOTWEAR', 'PERSONAL CARE'];

export default function CategoryToggleFilter() {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const handleCategoryChange = (category) => {
        dispatch({ type: 'setCategory', payload: category });
        setSelectedCategory(category);
    };

    return (
        <div className="flex flex-wrap justify-center md:justify-start space-x-2 space-y-2 md:space-y-0 mt-4">
            {Categories.map((category) => (
                <button
                    key={category}
                    className={`px-4 py-2 rounded-lg transition ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => handleCategoryChange(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
