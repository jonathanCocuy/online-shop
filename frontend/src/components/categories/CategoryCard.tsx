'use client';

import Link from 'next/link';

export interface CategoryCardData {
    id: string;
    name: string;
    slug: string;
    gradient: string;
    productCount: number;
}

interface CategoryCardProps {
    category: CategoryCardData;
    onClick?: (category: CategoryCardData) => void;
    isActive?: boolean;
}

function CardContent({ category }: { category: CategoryCardData }) {
    const { name, gradient, productCount } = category;
    return (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-45`}></div>
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="relative z-10 text-center space-y-1">
                <p className="text-sm font-semibold text-white">{name.toUpperCase()}</p>
                <p className="text-xs text-white/60">{productCount.toLocaleString()} productos</p>
            </div>
        </>
    );
}

export default function CategoryCard({ category, onClick, isActive }: CategoryCardProps) {
    const wrapperClasses = `
        group relative overflow-hidden rounded-2xl h-28 md:h-32 border bg-black/70 flex items-center justify-center transition-all duration-200
        ${isActive ? 'border-white/70 shadow-lg shadow-blue-500/20 scale-105' : 'border-white/30 hover:border-white/60 hover:shadow-xl hover:shadow-blue-500/30'}
    `;

    if (onClick) {
        return (
            <button
                type="button"
                aria-label={`View ${category.name} category`}
                className={wrapperClasses}
                onClick={() => onClick(category)}
            >
                <CardContent category={category} />
            </button>
        );
    }

    return (
        <Link
            href={`/categories`}
            aria-label={`View ${category.name} category`}
            className={wrapperClasses}
        >
            <CardContent category={category} />
        </Link>
    );
}
