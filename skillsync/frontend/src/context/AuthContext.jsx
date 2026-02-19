import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('skillsync_token');
        if (token) {
            authAPI.getMe()
                .then((res) => setUser(res.data.user))
                .catch(() => localStorage.removeItem('skillsync_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('skillsync_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, role = 'student', orgData = {}) => {
        const res = await authAPI.register({ name, email, password, role, ...orgData });
        localStorage.setItem('skillsync_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('skillsync_token');
        setUser(null);
    };

    const updateUser = (updatedUser) => setUser(updatedUser);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
