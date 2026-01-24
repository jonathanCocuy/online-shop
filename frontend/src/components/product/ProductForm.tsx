"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

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

export default function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: "",
        image_url: "",
        stock: "",
        category: "",
        currency: "COP",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onCancel();
    };

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
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
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
                        type="number"
                        name="price"
                        label="Price ($)"
                        required
                        min="0"
                        step={formData.currency === "COP" ? 100 : 0.01}
                        value={formData.price}
                        onChange={handleChange}
                        placeholder={formData.currency === "COP" ? "0" : "0.00"}
                        colorScheme="blue"
                        variant="outlined"
                    />
                </div>

                <div>
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
                        variant="outlined"
                    />
                </div>
            </div>

            <div>
                <Select
                    label="Category"
                    required
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    options={[
                        { value: "", label: "Select a category" },
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
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.image_url}
                    onClick={handleSubmit}
                >
                    Create Product
                </Button>
            </div>
        </form>
    );
}