'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'floating';
    colorScheme?: 'blue' | 'green' | 'purple' | 'red' | 'gray';
    inputSize?: 'sm' | 'md' | 'lg';
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
        variant = 'default',
        colorScheme = 'blue',
        inputSize = 'md',
        label,
        error,
        helperText,
        icon,
        iconPosition = 'left',
        className = '',
        ...props
    }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(e.target.value !== '');
        if (props.onChange) props.onChange(e);
    };

    const baseStyles = 'w-full transition-all duration-200 focus:outline-none';
    
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
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
        default: `border border-gray-300 rounded-lg bg-white ${error ? 'border-red-500' : getColorStyles(colorScheme)} focus:ring-2`,
        filled: `border-0 rounded-lg ${error ? 'bg-red-50' : 'bg-gray-100'} ${getColorStyles(colorScheme)} focus:ring-2`,
        outlined: `border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-transparent ${getColorStyles(colorScheme)}`,
        underlined: `border-0 border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-none bg-transparent ${getColorStyles(colorScheme)} px-0`,
        floating: `border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white ${getColorStyles(colorScheme)} focus:ring-2 peer`,
    };

    const iconStyles = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
    const inputClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[inputSize]} ${iconStyles} ${className}`;

    return (
        <div className="w-full">
        {label && variant !== 'floating' && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            </label>
        )}
        
        <div className="relative">
            {icon && iconPosition === 'left' && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
            
            <input
                className={inputClasses}
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
                    : 'top-1/2 -translate-y-1/2 text-gray-500'
                }`}
            >
                {label}
            </label>
            )}
            
            {icon && iconPosition === 'right' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
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

// Iconos simples SVG
const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);