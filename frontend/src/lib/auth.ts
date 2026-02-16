const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterValues {
    user_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface LoginValues {
    email: string;
    password: string;
}

const hasLocalStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
const getLocalStorage = () => (hasLocalStorage() ? window.localStorage : null);

const decodeJwtPayload = (token: string) => {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    try {
        const decoded = typeof window !== "undefined"
            ? window.atob(base64Payload)
            : Buffer.from(base64Payload, 'base64').toString('utf8');
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

export const authService = {
    async register(userData: RegisterValues) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            return data;

        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    },

    async login(credentials: LoginValues) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(credentials)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Error en el login');
            }

            return data;

        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    },

    async logout() {
        const storage = getLocalStorage();
        storage?.removeItem('token');
    },

    getToken() {
        const storage = getLocalStorage();
        return storage?.getItem('token') ?? null;
    },

    setToken(token: string) {
        const storage = getLocalStorage();
        storage?.setItem('token', token);
    },

    isAuthenticated() {
        return this.getToken() !== null;
    },

    getUserId(): number | null {
        const token = this.getToken();
        if (!token) return null;
        const payload = decodeJwtPayload(token);
        if (!payload || typeof payload !== 'object') return null;
        const userId = payload['userId'] ?? payload['user_id'] ?? payload['id'];
        return typeof userId === 'number' ? userId : (typeof userId === 'string' ? Number(userId) || null : null);
    }
};