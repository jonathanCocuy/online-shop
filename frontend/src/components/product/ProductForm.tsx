"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import Swal from 'sweetalert2';

interface ProductFormProps {
    onSubmit: (productData: ProductFormData) => void;
    onCancel: () => void;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    stock: number | string;
    category: string;
    currency: string;
}

// Configuration of currency formats
const CURRENCY_CONFIG = {
    COP: { 
        decimals: 0, 
        locale: 'es-CO', 
        symbol: "$",
        thousandSeparator: '.',
        decimalSeparator: ''
    },
    USD: { 
        decimals: 2, 
        locale: 'en-US', 
        symbol: "$",
        thousandSeparator: ',',
        decimalSeparator: '.'
    },
    EUR: { 
        decimals: 2, 
        locale: 'de-DE', 
        symbol: "€",
        thousandSeparator: '.',
        decimalSeparator: ','
    },
    GBP: { 
        decimals: 2, 
        locale: 'en-GB', 
        symbol: "£",
        thousandSeparator: ',',
        decimalSeparator: '.'
    },
};

export default function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: "",
        image_url: "",
        stock: "",
        category: "",
        currency: "",
    });

    const [displayPrice, setDisplayPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value as keyof typeof CURRENCY_CONFIG;
        setFormData(prev => ({ 
            ...prev, 
            currency: newCurrency,
            price: ""
        }));
        setDisplayPrice("");
    };

    const formatPrice = (value: string, currency: keyof typeof CURRENCY_CONFIG): string => {
        const config = CURRENCY_CONFIG[currency];

        let cleaned = value.replace(new RegExp(`[^\\d${config.decimalSeparator}]`, 'g'), '');
        
        if (config.decimals === 0) {
            const numbers = cleaned.replace(/\D/g, '');
            if (!numbers) return '';
            const number = parseInt(numbers);
            return number.toLocaleString(config.locale);
        } else {
            const parts = cleaned.split(config.decimalSeparator);
            
            if (parts.length > 2) {
                cleaned = parts[0] + config.decimalSeparator + parts.slice(1).join('');
                return cleaned;
            }
            
            if (parts.length === 2 && parts[1].length > config.decimals) {
                parts[1] = parts[1].slice(0, config.decimals);
            }
            
            if (parts[0]) {
                const integerPart = parseInt(parts[0].replace(/\D/g, '') || '0');
                const formattedInteger = integerPart.toLocaleString(config.locale).split(config.decimalSeparator)[0];
                
                if (parts.length === 2) {
                    return formattedInteger + config.decimalSeparator + parts[1];
                }
                return formattedInteger + (cleaned.endsWith(config.decimalSeparator) ? config.decimalSeparator : '');
            }
            
            return cleaned;
        }
    };

    const parseToRawValue = (value: string, currency: keyof typeof CURRENCY_CONFIG): string => {
        const config = CURRENCY_CONFIG[currency];
        
        if (config.decimals === 0) {
            // Para COP, solo números
            return value.replace(/\D/g, '');
        } else {
            // Para otras monedas, convertir al formato estándar (punto decimal)
            let raw = value.replace(new RegExp(`[^\\d${config.decimalSeparator}]`, 'g'), '');
            // Reemplazar el separador decimal de la moneda por punto
            if (config.decimalSeparator !== '.') {
                raw = raw.replace(config.decimalSeparator, '.');
            }
            return raw;
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const currency = formData.currency as keyof typeof CURRENCY_CONFIG;
        
        // Guardar el valor sin formato para el estado (con punto decimal estándar)
        const rawValue = parseToRawValue(value, currency);
        setFormData(prev => ({ ...prev, price: rawValue }));
        
        // Formatear para mostrar
        const formatted = formatPrice(value, currency);
        setDisplayPrice(formatted);
    };

    const handlePriceBlur = () => {
        const currency = formData.currency as keyof typeof CURRENCY_CONFIG;
        const config = CURRENCY_CONFIG[currency];
        
        if (formData.price && config.decimals > 0) {
            const num = parseFloat(formData.price as string);
            if (!isNaN(num)) {
                const formatted = num.toFixed(config.decimals);
                setFormData(prev => ({ ...prev, price: formatted }));
                
                // Convertir el formato estándar al formato de la moneda
                const parts = formatted.split('.');
                let display = parseInt(parts[0]).toLocaleString(config.locale).split(config.decimalSeparator)[0];
                if (parts[1]) {
                    display += config.decimalSeparator + parts[1];
                }
                setDisplayPrice(display);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        
        try {
            // Convertir el precio a número antes de enviar
            const config = CURRENCY_CONFIG[formData.currency as keyof typeof CURRENCY_CONFIG];
            const priceValue = config.decimals === 0
                ? parseInt((formData.price as string).replace(/\D/g, '') || '0')
                : parseFloat((formData.price as string) || '0');
            
            await onSubmit({
                ...formData,
                price: priceValue
            });

            await Swal.fire({
                title: 'Success!',
                text: 'Product created successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            onCancel();
            
        } catch (error) {
            console.error('Error creating product:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create product',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currencyConfig = CURRENCY_CONFIG[formData.currency as keyof typeof CURRENCY_CONFIG];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Input
                    type="text"
                    name="name"
                    label="Product Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    colorScheme="blue"
                    variant="outlined"
                />
            </div>

            <div>
                <Textarea
                    name="description"
                    label="Description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    colorScheme="blue"
                    variant="outlined"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Select
                        label="Currency"
                        placeholder="Select a currency"
                        required
                        value={formData.currency}
                        onChange={handleCurrencyChange}
                        options={[
                            { value: "COP", label: "COP" },
                            { value: "USD", label: "USD" },
                            { value: "EUR", label: "EUR" },
                            { value: "GBP", label: "GBP" },
                        ]}
                        colorScheme="blue"
                        variant="outlined"
                    />
                </div>
                <div>
                    <Input
                        type="text"
                        name="price"
                        label={`Price ${currencyConfig ? `(${currencyConfig.symbol})` : ''}`}
                        required
                        value={displayPrice}
                        onChange={handlePriceChange}
                        onBlur={handlePriceBlur}
                        placeholder={
                            formData.currency === 'COP' ? "1.000.000" :
                            formData.currency === 'EUR' ? "1.000.000,00" :
                            formData.currency === 'USD' || formData.currency === 'GBP' ? "1,000,000.00" :
                            "Enter price"
                        }
                        colorScheme="blue"
                        variant="outlined"
                        disabled={!formData.currency}
                    />
                </div>

                <div>
                    <Input
                        type="number"
                        name="stock"
                        label="Stock"
                        required
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        colorScheme="blue"
                        variant="outlined"
                    />
                </div>
            </div>

            <div>
                <Select
                    label="Category"
                    placeholder="Select a category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    options={[
                        { value: "technology", label: "Technology" },
                        { value: "home", label: "Home" },
                        { value: "shoes", label: "Shoes" },
                        { value: "accesories", label: "Accesories" },
                        { value: "sports", label: "Sports" },
                        { value: "clothes", label: "Clothes" },
                    ]}
                    colorScheme="blue"
                    variant="outlined"
                />
            </div>

            <div>
                <Input
                    type="url"
                    name="image_url"
                    label="Image URL"
                    required
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    colorScheme="blue"
                    variant="outlined"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="danger"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={
                        !formData.name || 
                        !formData.description || 
                        !formData.price || 
                        !formData.stock || 
                        !formData.category || 
                        !formData.currency ||
                        !formData.image_url ||
                        isSubmitting
                    }
                >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}