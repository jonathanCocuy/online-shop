'use client';

import Image from 'next/image';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/product';
import tippy from 'tippy.js';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { authService } from '@/lib/auth';

export interface FavouriteCardProps {
    product: Product;
    onDelete: () => void;
    handleAddToCart: () => void;
}

const formatCurrency = (value: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2
        }).format(value);
    } catch {
        return `$${value.toLocaleString()}`;
    }
};

export default function FavouriteCard({ product, onDelete, handleAddToCart }: FavouriteCardProps) {
    useEffect(() => {
        tippy('[data-tippy-content]');
    }, []);
    return (
        <div className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[30px] bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl opacity-70"></div>
            <div className="relative z-10 flex items-center gap-6 rounded-2xl lg:rounded-[30px] border border-white/10 bg-slate-900/90 px-6 py-4 shadow-2xl shadow-blue-500/20 transition-transform duration-300 hover:-translate-y-0.5">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm lg:text-lg font-semibold text-white leading-snug line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-400 mt-0.5">
                                {formatCurrency(product.price, product.currency)}
                            </p>
                        </div>
                        <span className="hidden lg:inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                            {product.category?.toUpperCase() ?? product.category_id}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className=" text-red-400 border border-red-500/40 hover:text-red-500 hover:border-red-400 focus:ring-red-400 flex items-center gap-2"
                        onClick={onDelete}
                        type="button"
                    >
                        <Trash2 size={18} fill="red" color="black" data-tippy-content="Remove from favorites"/>
                        <p className="hidden lg:block text-red-300">Remove from favorites</p>
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className=" text-blue-400 border border-blue-500/40 hover:text-blue-500 hover:border-blue-400 focus:ring-blue-400 flex items-center gap-2"
                        onClick={handleAddToCart}
                        type="button"
                    >
                        <ShoppingCart size={18} fill="blue" color="black" data-tippy-content="Add to cart"/>
                        <p className="hidden lg:block text-blue-300">Add to cart</p>
                    </Button>
                </div>

            </div>
        </div>
    );
}
