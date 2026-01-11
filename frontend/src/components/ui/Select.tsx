'use client';

import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'floating';
    colorScheme?: 'blue' | 'green' | 'purple' | 'red' | 'gray';
    selectSize?: 'sm' | 'md' | 'lg';
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
    variant = 'default',
    colorScheme = 'blue',
    selectSize = 'md',
    label,
    error,
    helperText,
    options,
    icon,
    iconPosition = 'left',
    placeholder,
    className = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value && props.value !== '');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setHasValue(e.target.value !== '');
        if (props.onChange) props.onChange(e);
    };

    const baseStyles = 'w-full transition-all duration-200 focus:outline-none appearance-none cursor-pointer';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-3 text-base',
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

    // Determinar el color del texto basado en si hay un valor seleccionado
    const textColorClass = hasValue || (props.value && props.value !== '') ? 'text-gray-700' : 'text-gray-400';

    const variantStyles = {
        default: `text-md ${textColorClass} border border-gray-300 rounded-2xl bg-white ${error ? 'border-red-500' : getColorStyles(colorScheme)} focus:ring-2`,
        filled: `text-md ${textColorClass} border-0 rounded-2xl ${error ? 'bg-red-50' : 'bg-gray-100'} ${getColorStyles(colorScheme)} focus:ring-2`,
        outlined: `text-md ${textColorClass} border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-2xl bg-transparent ${getColorStyles(colorScheme)}`,
        underlined: `text-md ${textColorClass} border-0 border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-none bg-transparent ${getColorStyles(colorScheme)} px-0`,
        floating: `text-md ${textColorClass} border ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} rounded-2xl bg-white ${getColorStyles(colorScheme)} focus:ring-2 peer`,
    };

    const iconStyles = icon ? (iconPosition === 'left' ? 'pl-10 pr-10' : 'pr-10') : 'pr-10';
    const selectClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[selectSize]} ${iconStyles} ${className}`;

    return (
        <div className="w-full">
        {label && variant !== 'floating' && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            </label>
        )}
        
        <div className="relative">
            {icon && iconPosition === 'left' && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                    {icon}
                </div>
            )}
            
            <select
                ref={ref}
                className={selectClasses}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
                defaultValue=""
                {...props}
            >
            {placeholder && (
                <option value="" disabled>
                {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-700">
                {option.label}
                </option>
            ))}
            </select>
            
            {variant === 'floating' && label && (
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none
                    ${isFocused || hasValue || props.value
                        ? `-top-2 text-xs bg-white px-1 ${error ? 'text-red-500' : getLabelColorClass(colorScheme)}`
                        : 'top-1/2 -translate-y-1/2 text-gray-500'
                    }`
                }
            >
                {label}
            </label>
            )}
            
            {/* Flecha del select */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
        
        {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        </div>
    );
});

Select.displayName = 'Select';