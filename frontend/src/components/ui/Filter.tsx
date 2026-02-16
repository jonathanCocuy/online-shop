'use client';

import { Filter as FilterIcon } from 'lucide-react';

export interface CategoryFilterProps {
    sortBy: string;
    onSortChange: (value: string) => void;
}

export default function CategoryFilter({ sortBy, onSortChange }: CategoryFilterProps) {
    return (
        <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-4 py-2">
            <FilterIcon className="text-gray-400" size={18} />
            <span className="text-gray-400 uppercase text-xs tracking-[0.4em]">Sort by</span>
            <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
            </select>
        </div>
    );
}
