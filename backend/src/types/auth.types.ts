export interface JwtPayload {
    id: number;
    email: string;
    role: 'client' | 'seller' | 'admin';
}