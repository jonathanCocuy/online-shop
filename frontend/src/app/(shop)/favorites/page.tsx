'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import FavouriteCard from '@/components/favourites/FavouriteCard';
import { Product } from '@/lib/product';
import { favoritesService } from '@/lib/favorites';
import { authService } from '@/lib/auth';

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
        } catch (err) {
            console.error('Failed to remove favorite', err);
            setError('Could not remove favorite.');
        }
    };

    return (
        <div className="max-w-7xl w-full min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden w-full mt-10 mb-10">
                <div className="relative max-w-7xl mx-auto w-full p-8">
                    <div className="text-left flex items-center justify-between">
                        <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="text-5xl font-bold text-white flex items-center gap-3 justify-center">
                                <Heart size={36} />
                                Favorites
                            </h1>
                            <p className="text-gray-400 text-lg">
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
                            <FavouriteCard key={product.id} product={product} onDelete={() => handleDelete(product.id || 0)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}