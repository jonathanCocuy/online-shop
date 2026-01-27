'use client';

import { useEffect, useState } from 'react';
import { Product, productService } from '@/lib/product';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
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

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(params.id as string);
                setLoading(true);
                setProduct(data);
                setError(null);
            } catch {
                setError('');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleDeleteProduct = async () => {
        // Mostrar confirmación antes de eliminar
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        // Si el usuario confirma
        if (result.isConfirmed) {
            try {
                await productService.deleteProduct(params.id as string);
                
                // Mostrar alerta de éxito
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Product deleted successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Redirigir a la página de productos
                router.push('/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                
                // Mostrar alerta de error
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete product',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    // Función para formatear el precio según la moneda
    const formatPrice = (price: number | string, currency: string): string => {
        const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
        if (!config) return `${currency} ${price}`;
        
        // Convertir a número si viene como string
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        return numPrice.toLocaleString(config.locale, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex justify-center items-center">
                <div className="text-xl">Charging product...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
                <div className="text-xl text-red-600">{error}</div>
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                    <Link href="/products" className="mt-4 text-blue-500 hover:underline">
                        ← Back to products
                    </Link>
                </Button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
                <div className="text-xl text-red-600">Product not found</div>
                <div className="text-sm text-gray-500 mt-2">Searched ID: {params.id}</div>
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <Link href="/products">
                        ← Back to products
                    </Link>
                </Button>
            </div>
        );
    }

    const currencyConfig = CURRENCY_CONFIG[product.currency as keyof typeof CURRENCY_CONFIG];

    return (
        <div className="bg-black text-white w-full max-w-7xl flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 py-8">
                <Button variant="primary" size="md" className="flex items-center gap-2 mb-6">
                    <Link href="/products">
                        ← Back to products
                    </Link>
                </Button>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    {/* Imagen del producto */}
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            width={1000}
                            height={1000}
                        />
                    </div>

                    {/* Información del producto */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                        
                        <div className="mb-4">
                            <span className="inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                                {product.category.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex items-end justify-start gap-1">
                            <p className="text-5xl font-bold text-white mb-8">
                                {currencyConfig?.symbol || product.currency} {formatPrice(product.price, product.currency)}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Description:</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-3">Availability:</h2>
                            {product.stock > 0 ? (
                                <p className="text-green-500 text-lg">
                                    In stock ({product.stock} units)
                                </p>
                            ) : (
                                <p className="text-red-500 text-lg font-semibold">Out of stock</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {product.stock > 0 && (
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    className="flex items-center gap-2"
                                    disabled={product.stock === 0}
                                >
                                    Add to cart
                                </Button>
                            )}
                            <Button variant="danger" size="lg" className="flex items-center gap-2" onClick={handleDeleteProduct}>
                                Delete product
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}