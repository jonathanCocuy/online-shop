 'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import Swal from 'sweetalert2';
import { Product } from '@/lib/product';
import { categoryService } from '@/lib/category';

interface ProductFormProps {
    onSubmit: (productData: ProductFormData) => void;
    onCancel: () => void;
    initialData?: Product;
    isEditMode?: boolean; 
}

export interface ProductFormData {
    id?: string | number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    stock: number | string;    
    category_id: string;
    currency: string;
}   

const CURRENCY_CONFIG = {
    COP: { decimals: 0, locale: 'es-CO', symbol: "$", decimalSeparator: ',' },
    USD: { decimals: 2, locale: 'en-US', symbol: "$", decimalSeparator: '.' },
    EUR: { decimals: 2, locale: 'de-DE', symbol: "€", decimalSeparator: ',' },
    GBP: { decimals: 2, locale: 'en-GB', symbol: "£", decimalSeparator: '.' },
};

export default function ProductForm({ onSubmit, onCancel, initialData, isEditMode = false }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        image_url: initialData?.image_url || "",
        stock: initialData?.stock ?? "",
        category_id: initialData?.category_id != null ? String(initialData.category_id) : "",
        currency: initialData?.currency || "USD",
    });

    const [displayPrice, setDisplayPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efecto para cargar datos iniciales correctamente
    useEffect(() => {
        if (initialData?.price !== undefined && initialData?.currency) {
            const config = CURRENCY_CONFIG[initialData.currency as keyof typeof CURRENCY_CONFIG];
            if (config) {
                const rawPrice = initialData.price.toString();
                setFormData(prev => ({ 
                    ...prev, 
                    price: rawPrice,
                    currency: initialData.currency as string
                }));
                
                // Formateo inicial para la vista
                const formatted = new Intl.NumberFormat(config.locale, {
                    minimumFractionDigits: config.decimals,
                    maximumFractionDigits: config.decimals,
                }).format(Number(rawPrice));
                
                setDisplayPrice(formatted);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value as keyof typeof CURRENCY_CONFIG;
        setFormData(prev => ({ ...prev, currency: newCurrency, price: "" }));
        setDisplayPrice("");
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        const currency = formData.currency as keyof typeof CURRENCY_CONFIG;
        const config = CURRENCY_CONFIG[currency];

        // 1. Limpiar el input: dejar solo números y el separador decimal actual
        const regex = new RegExp(`[^0-9${config.decimalSeparator === '.' ? '\\.' : config.decimalSeparator}]`, 'g');
        const cleanedValue = inputVal.replace(regex, '');

        // 2. Normalizar a formato estándar (con punto decimal) para el estado interno
        let standardValue = cleanedValue;
        if (config.decimalSeparator !== '.') {
            standardValue = cleanedValue.replace(config.decimalSeparator, '.');
        }

        setFormData(prev => ({ ...prev, price: standardValue }));

        // 3. Formateo visual rápido mientras escribe (sin decimales fijos aún)
        if (cleanedValue === "") {
            setDisplayPrice("");
        } else if (cleanedValue.endsWith(config.decimalSeparator)) {
            setDisplayPrice(cleanedValue); // Permite escribir la coma/punto
        } else {
            const num = parseFloat(standardValue);
            if (!isNaN(num)) {
                setDisplayPrice(new Intl.NumberFormat(config.locale).format(num));
            }
        }
    };

    const handlePriceBlur = () => {
        const currency = formData.currency as keyof typeof CURRENCY_CONFIG;
        const config = CURRENCY_CONFIG[currency];
        
        if (formData.price) {
            const num = parseFloat(formData.price as string);
            if (!isNaN(num)) {
                // Al salir, forzamos los decimales según la moneda
                const finalFormatted = new Intl.NumberFormat(config.locale, {
                    minimumFractionDigits: config.decimals,
                    maximumFractionDigits: config.decimals,
                }).format(num);
                
                setDisplayPrice(finalFormatted);
                setFormData(prev => ({ ...prev, price: num.toFixed(config.decimals) }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const priceValue = typeof formData.price === 'string' 
                ? parseFloat(formData.price) 
                : formData.price;
            
            await onSubmit({
                ...formData,
                price: priceValue,
                stock: Number(formData.stock)
            });

            await Swal.fire({
                title: 'Success!',
                text: isEditMode ? 'Product updated successfully' : 'Product created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            onCancel();
        } catch {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currencyConfig = CURRENCY_CONFIG[formData.currency as keyof typeof CURRENCY_CONFIG];
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const defaultCategories = [
        { value: "technology", label: "Technology" },
        { value: "home", label: "Home" },
        { value: "shoes", label: "Shoes" },
        { value: "accessories", label: "Accessories" },
        { value: "sports", label: "Sports" },
        { value: "clothes", label: "Clothes" },
    ];

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategoryOptions(data.map((category) => ({
                    value: String(category.id),
                    label: category.name
                })));
            } catch (error) {
                console.error('Unable to load categories', error);
            }
        };

        loadCategories();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                name="name"
                label="Product Name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                colorScheme="blue"
            />

            <Textarea
                name="description"
                label="Description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                colorScheme="blue"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
                <Input
                    name="price"
                    label={`Price ${currencyConfig ? `(${currencyConfig.symbol})` : ''}`}
                    required
                    value={displayPrice}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    placeholder="0.00"
                    colorScheme="blue"
                    disabled={!formData.currency}
                />

                <Input
                    type="number"
                    name="stock"
                    label="Stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    colorScheme="blue"
                />
            </div>

            <Select
                label="Category"
                placeholder="Select category"
                required
                value={formData.category_id.toUpperCase()}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                options={categoryOptions.length > 0 ? categoryOptions : defaultCategories}
                colorScheme="blue"
                className="text-uppercase capitalize"
            />

            <Input
                type="url"
                name="image_url"
                label="Image URL"
                required
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                colorScheme="blue"
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" onClick={onCancel} variant="danger" disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSubmitting || !formData.name || !formData.price}
                >
                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    );
}