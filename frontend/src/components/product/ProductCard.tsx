'use client';

import { Product } from '@/lib/product';
import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import Link from 'next/link';
import { favoritesService } from '@/lib/favorites';
import { authService } from '@/lib/auth';
import Swal from 'sweetalert2';

// Configuración de formatos por moneda
const CURRENCY_CONFIG = {
    COP: { 
        decimals: 0, 
        locale: 'es-CO', 
        symbol: "$",
    },
    USD: { 
        decimals: 2, 
        locale: 'en-US', 
        symbol: "$",
    },
    EUR: { 
        decimals: 2, 
        locale: 'de-DE', 
        symbol: "€",
    },
    GBP: { 
        decimals: 2, 
        locale: 'en-GB', 
        symbol: "£",
    },
};

// Componente de tarjeta de producto individual
export default function ProductCard({ product } : { product: Product }) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        tippy('[data-tippy-content]');
    }, []);

    // Función para formatear el precio según la moneda
    const formatPrice = (price: number | string, currency: string): string => {
        const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
        if (!config) return price.toString();
        
        // Convertir a número si viene como string
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        return numPrice.toLocaleString(config.locale, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
        });
    };

    const handleFavoriteToggle = async () => {
        if (!authService.isAuthenticated()) {
            Swal.fire({
                title: 'You are not authenticated',
                text: 'Please login to save favorites',
                icon: 'warning',
                confirmButtonText: 'Login',
                confirmButtonColor: '#3B82F6',
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'Cancel'
            });
            return;
        }

        try {
            if (isLiked) {
                await favoritesService.removeFavorite(product.id as string);
                setIsLiked(false);
            } else {
                await favoritesService.addFavorite(product.id as string | number);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Failed to update favorites', error);
        }
    };

    return (
        <div className="relative w-[295px]">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl opacity-60"></div>
            <div className="relative z-10 flex flex-col overflow-hidden rounded-[28px] shadow-2xl shadow-blue-500/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
                <div className="relative overflow-hidden bg-gray-100 h-64">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        width={500}
                        height={500}
                    />
                    {product.stock < 10 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Solo {product.stock} disponibles
                        </div>
                    )}
                </div>
                <div className="p-5 bg-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1" data-tippy-content={product.name}>
                            {product.name}
                        </h2>
                    </div>
                    <p className="text-blue-600 font-semibold text-sm line-clamp-2">{product.category?.toUpperCase() ?? product.category_id}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex items-end justify-start gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            ${formatPrice(product.price, product.currency)}
                        </span>
                        <span className="text-xs font-bold text-gray-900 mb-1">
                            {product.currency}
                        </span>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-4">
                        <div className="flex items-center gap-2">
                            <Button data-tippy-content="View product" variant="secondary" size="sm" className="flex items-center gap-2">
                                <Link href={`/products/${product.id}`}>
                                    <Eye size={20} />
                                </Link>
                            </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 group" onClick={handleFavoriteToggle}>
                                {isLiked ? (
                                    <Heart size={20} fill="red" className="transition-all duration-300" />
                                ) : (
                                    <Heart data-tippy-content="Add to favorites" size={20} className="group-hover:fill-red-500 transition-all duration-300" />
                                )}
                            </Button>
                        </div>
                        <Button variant="primary" size="sm" className="flex items-center gap-2">
                            Add to cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}