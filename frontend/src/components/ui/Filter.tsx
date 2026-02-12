'use client';

import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Filter as FilterIcon, SlidersHorizontal } from 'lucide-react';

export interface CategoryFilterProps {
    sortBy: string;
    onSortChange: (value: string) => void;
}

export default function CategoryFilter({
    sortBy,
    onSortChange,
}: CategoryFilterProps) {

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4">
            <div className="flex items-center gap-3 flex-wrap">
                <FilterIcon className="text-gray-400" size={20} />
                <span className="text-gray-400 font-semibold">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={(event) => onSortChange(event.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>
        </div>
    );
}
