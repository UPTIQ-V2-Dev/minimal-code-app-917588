import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredUser, isAuthenticated, clearAuthData } from '@/lib/api';
import { authService } from '@/services/auth';
import type { User, LoginRequest, SignupRequest } from '@/types/user';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(getStoredUser());
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            const currentUser = getStoredUser();
            setIsLoggedIn(authenticated);
            setUser(currentUser);
        };

        checkAuth();
        
        // Listen for storage changes (e.g., logout in another tab)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: (data) => {
            setUser(data.user);
            setIsLoggedIn(true);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        }
    });

    const registerMutation = useMutation({
        mutationFn: (userData: SignupRequest) => authService.register(userData),
        onSuccess: (data) => {
            setUser(data.user);
            setIsLoggedIn(true);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            setUser(null);
            setIsLoggedIn(false);
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Clear local state anyway
            clearAuthData();
            setUser(null);
            setIsLoggedIn(false);
            queryClient.clear();
        }
    });

    const login = (credentials: LoginRequest) => {
        return loginMutation.mutateAsync(credentials);
    };

    const register = (userData: SignupRequest) => {
        return registerMutation.mutateAsync(userData);
    };

    const logout = () => {
        return logoutMutation.mutateAsync();
    };

    return {
        user,
        isLoggedIn,
        login,
        register,
        logout,
        isLoginLoading: loginMutation.isPending,
        isRegisterLoading: registerMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
        logoutError: logoutMutation.error
    };
};