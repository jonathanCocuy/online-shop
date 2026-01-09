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
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },
    
    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    isAuthenticated() {
        return this.getToken() !== null;
    },
}