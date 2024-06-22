import React from 'react';
import { useDispatch } from 'react-redux';

export default function SortProductFilter({ isHide }) {
    const options = ['Default', 'Price: High to Low', 'Price: Low to High', 'Newest'];
    const dispatch = useDispatch();

    const handleSortChange = (e) => {
        dispatch({ type: 'setSortBy', payload: e.target.value });
    };

    return (
        <form
            style={{
                display: isHide ? 'none' : 'flex',
                alignItems: 'center',
                margin: '1rem',
                flex: 1,
            }}
            noValidate
            autoComplete="off"
        >
            <label htmlFor="sort-select" style={{ marginRight: '1rem' }}>Sort By:</label>
            <select
                id="sort-select"
                onChange={handleSortChange}
                defaultValue="Default"
                style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '25ch',
                }}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </form>
    );
}
