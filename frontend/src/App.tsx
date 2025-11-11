import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeCard } from '@/components/WelcomeCard';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export const App = () => {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/" 
                element={
                    isLoggedIn ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <div className="min-h-screen bg-background flex items-center justify-center p-4">
                            <WelcomeCard />
                        </div>
                    )
                } 
            />
        </Routes>
    );
};
