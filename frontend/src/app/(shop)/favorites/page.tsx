'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import FavouriteCard from '@/components/favourites/FavouriteCard';
import { Product } from '@/lib/product';
import { favoritesService } from '@/lib/favorites';
import { authService } from '@/lib/auth';
import Swal from 'sweetalert2';
import { cartService } from '@/lib/cart';
import router from 'next/router';

export default function Favorites() {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!authService.isAuthenticated()) {
                setError('Log in to see your favorites.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const items = await favoritesService.getFavorites();
                setFavorites(items);
            } catch (err) {
                console.error('Failed to load favorites', err);
                setError('Unable to load favorites right now.');
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const handleDelete = async (productId: number | string) => {
        if (!authService.isAuthenticated()) return;

        try {
            await favoritesService.removeFavorite(productId);
            setFavorites((prev) => prev.filter((product) => String(product.id) !== String(productId)));
            Swal.fire({
                title: 'Removed from favorites',
                text: 'Product removed from favorites',
                icon: 'success',
            })
        } catch (err) {
            console.error('Failed to remove favorite', err);
            Swal.fire({
                title: 'Error',
                text: 'Could not remove favorite.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleAddToCart = async (productId: number | string) => {
        if (!authService.isAuthenticated()) {
            Swal.fire({
                title: 'Authentication required',
                text: 'Please login to add products to your cart',
                icon: 'warning',
                confirmButtonText: 'Login',
                confirmButtonColor: '#3B82F6',
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'Cancel'
            });
            return;
        }

        try {
            await cartService.addToCart(productId as string | number, 1);
            const total = await cartService.getCartCount();
            Swal.fire({
                title: 'Added to cart',
                text: `Now you have ${total} ${total === 1 ? 'product' : 'products'} in your cart.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error?.message || 'Failed to add product to cart',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="max-w-7xl w-full min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden w-full pl-4 mt-6 mb-6 lg:mt-10 lg:mb-10">
                {/* Reducimos el padding en móvil (p-4) y lo mantenemos amplio en desktop (lg:p-8) */}
                <div className="relative max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">

                    {/* Magia aquí: flex-col en móvil, flex-row en lg. Agregamos gap para separar */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">

                        <div className="flex flex-col items-start justify-center gap-1 lg:gap-2">
                            <h1 className="text-2xl lg:text-5xl font-bold text-white flex items-center gap-2 lg:gap-3">
                                {/* Hacemos el icono responsivo usando clases en lugar de size fijo */}
                                <Heart className="w-6 h-6 lg:w-10 lg:h-10" />
                                Favorites
                            </h1>
                            <p className="text-gray-400 text-sm lg:text-lg">
                                Discover your favorite products
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <p className="text-gray-400">Loading favorites…</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 mb-4">{error}</p>
                        {!authService.isAuthenticated() && (
                            <p className="text-sm text-gray-500">
                                Log in to sync your favorite products.
                            </p>
                        )}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 mb-4">No favorites yet.</p>
                        <p className="text-sm text-gray-500">Add products to your list to see them here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {favorites.map((product) => (
                            <FavouriteCard key={product.id} product={product} onDelete={() => handleDelete(product.id || 0)} handleAddToCart={() => handleAddToCart(product.id || 0)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}