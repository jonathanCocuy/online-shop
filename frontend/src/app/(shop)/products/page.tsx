"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/lib/product";
import { Product } from "@/lib/product";
import Image from "next/image";

export default function Products() {

    useEffect(() => {
        productService.getProducts().then((products) => {
            console.log(products);
        });
    }, []);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        productService.getProducts().then((products) => {
            setProducts(products);
            setLoading(false);
        }).catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <h1 className="text-4xl font-bold">Products</h1>
            {products.map((product) => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <Image src={product.image_url} alt={product.name} width={300} height={300} />
                </div>
            ))}
        </div>
    );
}