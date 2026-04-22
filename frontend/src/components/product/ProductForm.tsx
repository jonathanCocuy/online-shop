'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import Swal from 'sweetalert2';
import { Product } from '@/lib/product';
import { categoryService } from '@/lib/category';
import { ImageIcon, Package, DollarSign, ChevronRight, Loader2 } from "lucide-react";

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

// FUERZA BRUTA PARA ELIMINAR EL BLANCO
// El ! indica important en Tailwind. Esto sobreescribe cualquier estilo previo.
const appleInputStyles = "!bg-[#1c1c1e] !border-none !text-white !placeholder-[#48484a] focus:!ring-2 focus:!ring-[#0071e3]/50 rounded-xl transition-all duration-200";
const labelStyles = "text-[12px] font-semibold text-[#8e8e93] ml-1 uppercase tracking-tight";

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
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

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

    useEffect(() => {
        if (initialData?.price !== undefined && initialData?.currency) {
            const config = CURRENCY_CONFIG[initialData.currency as keyof typeof CURRENCY_CONFIG];
            if (config) {
                const rawPrice = initialData.price.toString();
                setFormData(prev => ({ ...prev, price: rawPrice, currency: initialData.currency as string }));
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

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        const config = CURRENCY_CONFIG[formData.currency as keyof typeof CURRENCY_CONFIG];
        const regex = new RegExp(`[^0-9${config.decimalSeparator === '.' ? '\\.' : config.decimalSeparator}]`, 'g');
        const cleanedValue = inputVal.replace(regex, '');
        let standardValue = cleanedValue;
        if (config.decimalSeparator !== '.') standardValue = cleanedValue.replace(config.decimalSeparator, '.');
        setFormData(prev => ({ ...prev, price: standardValue }));
        if (cleanedValue === "") setDisplayPrice("");
        else {
            const num = parseFloat(standardValue);
            if (!isNaN(num)) setDisplayPrice(new Intl.NumberFormat(config.locale).format(num));
        }
    };

    const handlePriceBlur = () => {
        const config = CURRENCY_CONFIG[formData.currency as keyof typeof CURRENCY_CONFIG];
        if (formData.price) {
            const num = parseFloat(formData.price as string);
            if (!isNaN(num)) {
                setDisplayPrice(new Intl.NumberFormat(config.locale, {
                    minimumFractionDigits: config.decimals,
                    maximumFractionDigits: config.decimals,
                }).format(num));
                setFormData(prev => ({ ...prev, price: num.toFixed(config.decimals) }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const priceValue = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
            await onSubmit({ ...formData, price: priceValue, stock: Number(formData.stock) });
            await Swal.fire({
                title: 'Done!',
                text: isEditMode ? 'Product updated' : 'Product created',
                icon: 'success',
                background: '#1c1c1e',
                color: '#fff',
                confirmButtonColor: '#0071e3',
            });
            onCancel();
        } catch {
            Swal.fire({ title: 'Error', text: 'Action failed', icon: 'error', background: '#1c1c1e', color: '#fff' });
        } finally { setIsSubmitting(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-black !text-white antialiased font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className={labelStyles}>Product Name</label>
                        <Input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. AirPods Pro"
                            className={`${appleInputStyles} !h-12 !text-base`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelStyles}>Description</label>
                        <Textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the product..."
                            className={`${appleInputStyles} !p-4 min-h-[140px] resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className={labelStyles}>Price</label>
                            <Input
                                name="price"
                                required
                                value={displayPrice}
                                onChange={handlePriceChange}
                                onBlur={handlePriceBlur}
                                placeholder="0.00"
                                className={`${appleInputStyles} !h-12 !text-[#0071e3] !font-bold`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyles}>Stock</label>
                            <Input
                                type="number"
                                name="stock"
                                required
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                className={`${appleInputStyles} !h-12`}
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className={labelStyles}>Category</label>
                        <Select
                            required
                            value={formData.category_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                            options={categoryOptions}
                            className={`${appleInputStyles} !h-12 !w-full !appearance-none !cursor-pointer`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelStyles}>Media Asset URL</label>
                        <Input
                            type="url"
                            name="image_url"
                            required
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className={`${appleInputStyles} !h-12 !text-[13px] !font-mono`}
                        />
                    </div>

                    <div className="aspect-video w-full bg-[#1c1c1e] rounded-[2rem] border border-[#2c2c2e] flex items-center justify-center overflow-hidden">
                        {formData.image_url ? (
                            <img 
                                src={formData.image_url} 
                                alt="Preview" 
                                className="object-contain w-full h-full p-6"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/1c1c1e/48484a?text=Preview+Error')}
                            />
                        ) : (
                            <div className="text-[#48484a] flex flex-col items-center gap-2 italic text-sm">
                                <ImageIcon size={40} />
                                <span>No Image Preview</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end items-center gap-6 pt-10 mt-6 border-t border-[#1c1c1e]">
                <button type="button" onClick={onCancel} className="text-[#8e8e93] hover:text-white transition-colors text-sm">
                    Discard
                </button>
                <Button 
                    type="submit" 
                    className="!bg-[#0071e3] hover:!bg-[#0077ed] !text-white !px-10 !py-3 !rounded-full !font-bold flex items-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : isEditMode ? 'Update' : 'Create'}
                    <ChevronRight size={16} />
                </Button>
            </div>
        </form>
    );
}