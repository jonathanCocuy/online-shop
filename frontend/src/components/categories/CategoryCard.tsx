'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface CategoryCardData {
    id: string;
    name: string;
    slug: string;
    image: string;
    gradient: string;
    productCount: number;
}

interface CategoryCardProps {
    category: CategoryCardData;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const { name, slug, image, gradient, productCount } = category;

    return (
        <Link
            href={`/categories/${slug}`}
            aria-label={`View ${name} category`}
            className="group relative overflow-hidden rounded-2xl cursor-pointer h-64"
        >
            <div className="absolute inset-0">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 group-hover:opacity-75 transition-opacity duration-300`}></div>
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg mb-1 group-hover:translate-y-[-4px] transition-transform duration-300">
                    {name}
                </h3>
                <p className="text-white/80 text-sm">
                    {productCount.toLocaleString()} items
                </p>
            </div>

            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="text-white" size={16} />
            </div>
        </Link>
    );
}
