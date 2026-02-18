'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { Product, productService } from '@/lib/product';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { SlideOver } from "@/components/ui/SlideOver";
import ProductForm, { ProductFormData } from '@/components/product/ProductForm';
import { Pencil, Trash2 } from 'lucide-react';

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
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);

    // Función para cargar el producto
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(params.id as string);
            setProduct(data);
            const currentUser = authService.getUserId();
            setIsOwner(currentUser !== null && Number(data?.user_id) === currentUser);
            setError(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error loading product';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const handleDeleteProduct = async () => {
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

        if (result.isConfirmed) {
            try {
                await productService.deleteProduct(params.id as string);
                
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Product deleted successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                router.push('/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete product',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleUpdateProduct = async (productData: ProductFormData) => {
        try {
            // 1. Actualizar el estado local INMEDIATAMENTE (optimistic update)
            setProduct(prev => prev ? {
                ...prev,
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                image_url: productData.image_url,
                stock: Number(productData.stock),
                category_id: productData.category_id,
                currency: productData.currency
            } : null);

            // 2. Cerrar el modal INMEDIATAMENTE
            setIsSlideOverOpen(false);

            // 3. Actualizar en el backend en segundo plano
            const response = await productService.updateProduct({
                id: params.id as string,
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                image_url: productData.image_url,
                stock: Number(productData.stock),
                category_id: productData.category_id,
                currency: productData.currency
            });

            if (response.success) {
                // 4. Mostrar alerta de éxito
                await Swal.fire({
                    title: 'Success!',
                    text: 'Product updated successfully',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                // 5. Opcional: Sincronizar con el servidor para confirmar
                await fetchProduct();
            } else {
                // Si falla, revertir al estado anterior
                await fetchProduct();
                Swal.fire({
                    title: 'Error',
                    text: response.message || 'Could not update product',
                    icon: 'error',
                });
            }
        } catch (error) {
            // Si hay error, recargar el producto original
            await fetchProduct();
            console.error('Error updating product:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while updating',
                icon: 'error',
            });
        }
    };

    const handleCloseModal = () => {
        setIsSlideOverOpen(false);
    };

    // Función para formatear el precio según la moneda
    const formatPrice = (price: number | string, currency: string): string => {
        const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
        if (!config) return `${currency} ${price}`;
        
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        return numPrice.toLocaleString(config.locale, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="text-xl">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="text-xl text-red-600 mb-4">{error}</div>
                <Link href="/products">
                    <Button variant="primary" size="lg">
                        ← Back to products
                    </Button>
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="text-xl text-red-600 mb-2">Product not found</div>
                <div className="text-sm text-gray-500 mb-4">Searched ID: {params.id}</div>
                <Link href="/products">
                    <Button variant="primary" size="lg">
                        ← Back to products
                    </Button>
                </Link>
            </div>
        );
    }

    const currencyConfig = CURRENCY_CONFIG[product.currency as keyof typeof CURRENCY_CONFIG];

    return (
        <div className="min-h-screen text-white flex flex-col items-center mt-10">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link href="/products">
                    <Button variant="primary" size="md" className="mb-6">
                        ← Back to products
                    </Button>
                </Link>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    {/* Imagen del producto */}
                    <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            width={1000}
                            height={1000}
                            priority
                            key={product.image_url} // Forzar re-render cuando cambie la imagen
                        />
                    </div>

                    {/* Información del producto */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                        
                        <div className="mb-4">
                            <span className="inline-block bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                                {product.category?.toUpperCase() ?? product.category_id}
                            </span>
                        </div>

                        <p className="text-5xl font-bold text-white mb-8">
                            {currencyConfig?.symbol || product.currency} {formatPrice(product.price, product.currency)}
                        </p>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Description:</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-3">Availability:</h2>
                            {product.stock > 0 ? (
                                <p className="text-green-500 text-lg font-semibold">
                                    ✓ In stock ({product.stock} units)
                                </p>
                            ) : (
                                <p className="text-red-500 text-lg font-semibold">✗ Out of stock</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {product.stock > 0 && (
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    Add to cart
                                </Button>
                            )}
                            {isOwner && (
                                <Button 
                                    variant="secondary" 
                                    size="lg" 
                                    className="flex items-center justify-center gap-2" 
                                    onClick={() => setIsSlideOverOpen(true)}
                                >
                                    <Pencil size={18} />
                                    Edit
                                </Button>
                            )}
                            {isOwner && (
                                <Button 
                                    variant="danger" 
                                    size="lg" 
                                    className="flex items-center justify-center gap-2" 
                                    onClick={handleDeleteProduct}
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {isOwner && (
                <SlideOver
                    isOpen={isSlideOverOpen}
                    onClose={handleCloseModal}
                    title="Edit Product"
                >
                    <ProductForm 
                        initialData={product}
                        onSubmit={handleUpdateProduct}
                        onCancel={handleCloseModal}
                        isEditMode={true}
                    />
                </SlideOver>
            )}
        </div>
    );
}