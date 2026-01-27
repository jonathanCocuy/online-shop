'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    size = 'md',
    children,
    className = '',
    ...props 
}) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95';
    
    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
        info: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 focus:ring-gray-500 border border-gray-300',
    };
    
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    
    return (
        <button className={combinedStyles} {...props}>
            {children}
        </button>
    );
};