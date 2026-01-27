'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, productService } from '@/lib/product';
import ProductForm, { ProductFormData } from '@/components/product/ProductForm';
import { SlideOver } from '@/components/ui/SlideOver';
import Swal from 'sweetalert2';

interface EditProductPageProps {
    onProductUpdated?: () => void;
}

export default function EditProductPage({ onProductUpdated }: EditProductPageProps) {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(params.id as string);
                setProduct(data);
            } catch (error) {
                console.error('Error loading product:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Could not load product',
                    icon: 'error',
                });
                router.push('/products');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router]);

    const handleUpdateProduct = async (productData: ProductFormData) => {
        try {
            const response = await productService.updateProduct({
                id: params.id as string,
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                image_url: productData.image_url,
                stock: Number(productData.stock),
                category: productData.category,
                currency: productData.currency
            });

            if (response.success) {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Product updated successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Llamar al callback para refrescar el producto
                if (onProductUpdated) {
                    onProductUpdated();
                }
                
                router.push(`/products/${params.id}`);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message || 'Could not update product',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while updating',
                icon: 'error',
            });
        }
    };

    const handleCancel = () => {
        setIsSlideOverOpen(false);
        setTimeout(() => {
            router.push(`/products/${params.id}`);
        }, 300);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="text-white text-xl">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <SlideOver
                isOpen={isSlideOverOpen}
                onClose={handleCancel}
                title="Edit Product"
            >
                <ProductForm
                    initialData={product}
                    onSubmit={handleUpdateProduct}
                    onCancel={handleCancel}
                    isEditMode={true}
                />
            </SlideOver>
        </div>
    );
}