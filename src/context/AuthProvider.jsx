import { createContext, useState, useEffect, Children } from "react";

export const AuthContext = createContext(); // отдельный контекст для авторизации

const AuthProvider = () => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setAuthLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData); // сохраняем пользователя в контексте
                }
            } catch (error) {
                console.error(error);
            } finally {
                setAuthLoading(false);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading }}>
            {Children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;