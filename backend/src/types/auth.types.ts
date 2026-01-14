export interface JwtPayload {
    id: number;
    email: string;
    role: 'CLIENT' | 'SELLER' | 'ADMIN';
}