'use client';

import { Product } from '@/lib/product';
import Image from 'next/image';


// Componente de tarjeta de producto individual
export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[302px]">
            <div className="relative overflow-hidden bg-gray-100">
                <Image 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    width={200}
                    height={200}
                />
                {product.stock < 10 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Solo {product.stock} disponibles
                    </div>
                )}
            </div>
            
            <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                    </span>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}
