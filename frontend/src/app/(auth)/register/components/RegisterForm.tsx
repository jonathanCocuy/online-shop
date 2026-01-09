'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            console.log(data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 w-full">
            {/* Contenedor del formulario */}
            <div className="relative w-full max-w-md">
                {/* Card principal */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Create your account
                    </h1>
                    <p className="text-gray-600">
                    Enter your credentials to register
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    variant="default"
                                    placeholder="Name"
                                    colorScheme="purple"
                                    {...register('user_name')}
                                    iconPosition="left"
                                    className={errors.user_name ? 'border-red-500' : ''}
                                    error={errors.user_name?.message}
                                />
                            </div>
                            {errors.user_name && (
                                <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1 animate-pulse">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.user_name?.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name Input */}
                        <div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    variant="default"
                                    placeholder="Last Name"
                                    colorScheme="purple"
                                    {...register('last_name')}
                                    iconPosition="left"
                                    className={errors.last_name ? 'border-red-500' : ''}
                                    error={errors.last_name?.message}
                                />
                            </div>
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1 animate-pulse">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.last_name?.message}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}

                        <div>
                            <div className="relative">
                                <Input
                                    type="email"
                                    variant="default"
                                    placeholder="Email"
                                    colorScheme="purple"
                                    {...register('email')}
                                    iconPosition="left"
                                    className={errors.email ? 'border-red-500' : ''}
                                    error={errors.email?.message}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1 animate-pulse">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email?.message}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                variant="floating"
                                placeholder="Password"
                                colorScheme="purple"
                                {...register('password')}
                                iconPosition="left"
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                )}
                            </button>
                            </div>
                            {errors.password && (
                            <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1 animate-pulse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.password?.message}
                            </p>
                            )}
                        </div>
                    </div>

                    {/* Botón de submit */}
                    <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                        </span>
                    ) : (
                        'Register'
                    )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-400 m-2"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className=" m-2 px-2 rounded-full bg-white border border-gray-500 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        Login here
                    </Link>
                    </p>
                </div>
                </div>

                {/* Texto adicional */}
                <p className="text-center text-sm text-gray-500 mt-4">
                By registering, you agree to our{' '}
                <a href="#" className="text-gray-700 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    )
}