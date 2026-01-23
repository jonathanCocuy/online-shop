"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ProductFormProps {
    onSubmit: (productData: ProductFormData) => void;
    onCancel: () => void;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category: string;
}

export default function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        stock: 0,
        category: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                <Input
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        type="number"
                        name="price"
                        label="Price ($)"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
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
                        { value: "electronics", label: "Electronics" },
                        { value: "clothing", label: "Clothing" },
                        { value: "books", label: "Books" },
                        { value: "toys", label: "Toys" },
                        { value: "other", label: "Other" }
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
                    variant="secondary"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                >
                    Create Product
                </Button>
            </div>
        </form>
    );
}