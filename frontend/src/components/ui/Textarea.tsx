'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'floating';
    colorScheme?: 'blue' | 'green' | 'purple' | 'red' | 'gray';
    textareaSize?: 'sm' | 'md' | 'lg';
    label?: string;
    error?: string;
    helperText?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea: React.FC<TextareaProps> = ({
    variant = 'default',
    colorScheme = 'blue',
    textareaSize = 'md',
    label,
    error,
    helperText,
    resize = 'none',
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHasValue(e.target.value !== '');
        if (props.onChange) props.onChange(e);
    };

    const baseStyles = 'w-full transition-all duration-200 focus:outline-none';
    
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm min-h-[80px]',
        md: 'px-4 py-2 text-base min-h-[100px]',
        lg: 'px-5 py-3 text-lg min-h-[120px]',
    };

    const resizeStyles = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    };

    const getColorStyles = (scheme: string) => {
        const styles = {
            blue: 'focus:ring-blue-500 focus:border-blue-500',
            green: 'focus:ring-green-500 focus:border-green-500',
            purple: 'focus:ring-purple-500 focus:border-purple-500',
            red: 'focus:ring-red-500 focus:border-red-500',
            gray: 'focus:ring-gray-500 focus:border-gray-500',
        };
        return styles[scheme as keyof typeof styles];
    };

    const getLabelColorClass = (scheme: string) => {
        const colors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            red: 'text-red-600',
            gray: 'text-gray-600',
        };
        return colors[scheme as keyof typeof colors];
    };

    const variantStyles = {
        default: `text-md text-gray-700 border border-gray-300 rounded-2xl bg-white ${error ? 'border-red-500' : getColorStyles(colorScheme)} focus:ring-2 placeholder:text-gray-400`,
        filled: `text-md text-gray-700 border-0 rounded-2xl ${error ? 'bg-red-50' : 'bg-gray-100'} ${getColorStyles(colorScheme)} focus:ring-2 placeholder:text-gray-400`,
        outlined: `text-md text-gray-700 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-2xl bg-transparent ${getColorStyles(colorScheme)} placeholder:text-gray-400`,
        underlined: `text-md text-gray-700 border-0 border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-none bg-transparent ${getColorStyles(colorScheme)} px-0 placeholder:text-gray-400`,
        floating: `text-md text-gray-700 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-2xl bg-white ${getColorStyles(colorScheme)} focus:ring-2 peer placeholder:text-gray-400`,
    };

    const textareaClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[textareaSize]} ${resizeStyles[resize]} ${className}`;

    return (
        <div className="w-full">
            {label && variant !== 'floating' && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative">
                <textarea
                    className={textareaClasses}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={handleChange}
                    placeholder={variant === 'floating' ? ' ' : props.placeholder}
                    {...props}
                />
                
                {variant === 'floating' && label && (
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none
                        ${isFocused || hasValue || props.value
                            ? `-top-2 text-xs bg-white px-1 ${getLabelColorClass(colorScheme)}`
                            : 'top-3 text-gray-500'
                        }`}
                    >
                        {label}
                    </label>
                )}
            </div>
            
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

// Demo component to showcase the Textarea
export default function TextareaDemo() {
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');
    const [value3, setValue3] = React.useState('');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Textarea Component</h1>
                    <p className="text-gray-600">Multiple variants and color schemes</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Variants</h2>
                    
                    <Textarea
                        variant="default"
                        label="Default Variant"
                        placeholder="Enter your message..."
                        helperText="This is the default style"
                        colorScheme="blue"
                    />

                    <Textarea
                        variant="filled"
                        label="Filled Variant"
                        placeholder="Enter your message..."
                        helperText="Filled background style"
                        colorScheme="green"
                    />

                    <Textarea
                        variant="outlined"
                        label="Outlined Variant"
                        placeholder="Enter your message..."
                        helperText="Thicker border outline"
                        colorScheme="purple"
                    />

                    <Textarea
                        variant="underlined"
                        label="Underlined Variant"
                        placeholder="Enter your message..."
                        helperText="Minimal underline style"
                        colorScheme="blue"
                    />

                    <Textarea
                        variant="floating"
                        label="Floating Label"
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                        helperText="Label floats up on focus"
                        colorScheme="purple"
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sizes</h2>
                    
                    <Textarea
                        textareaSize="sm"
                        label="Small"
                        placeholder="Small textarea..."
                        colorScheme="blue"
                    />

                    <Textarea
                        textareaSize="md"
                        label="Medium"
                        placeholder="Medium textarea..."
                        colorScheme="blue"
                    />

                    <Textarea
                        textareaSize="lg"
                        label="Large"
                        placeholder="Large textarea..."
                        colorScheme="blue"
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">States & Features</h2>
                    
                    <Textarea
                        label="With Error"
                        placeholder="Enter valid input..."
                        error="This field is required"
                        colorScheme="red"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                    />

                    <Textarea
                        label="Resize Options"
                        placeholder="Try resizing..."
                        resize="both"
                        helperText="This textarea can be resized both ways"
                        colorScheme="green"
                    />

                    <Textarea
                        label="No Resize"
                        placeholder="Fixed size..."
                        resize="none"
                        helperText="This textarea cannot be resized"
                        colorScheme="gray"
                        value={value3}
                        onChange={(e) => setValue3(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Color Schemes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea
                            variant="filled"
                            label="Blue"
                            placeholder="Blue theme..."
                            colorScheme="blue"
                        />
                        <Textarea
                            variant="filled"
                            label="Green"
                            placeholder="Green theme..."
                            colorScheme="green"
                        />
                        <Textarea
                            variant="filled"
                            label="Purple"
                            placeholder="Purple theme..."
                            colorScheme="purple"
                        />
                        <Textarea
                            variant="filled"
                            label="Red"
                            placeholder="Red theme..."
                            colorScheme="red"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}