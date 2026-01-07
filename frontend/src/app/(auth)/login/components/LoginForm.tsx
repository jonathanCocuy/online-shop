'use client';

import { loginSchema } from "../schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const { register, handleSubmit, formState: { errors } } = form;

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <form onSubmit={onSubmit}>
            <div>
                <Input type="email" variant="floating" placeholder="Email" {...register('email')} />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <Input type="password" variant="floating" placeholder="Password" {...register('password')} />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <Button type="submit">Login</Button>
            </div>
        </form>
    );

}