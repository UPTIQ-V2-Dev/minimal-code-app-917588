import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage = () => {
    const { user, logout, isLogoutLoading } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
                    </div>
                    <Button 
                        onClick={handleLogout} 
                        variant="outline"
                        disabled={isLogoutLoading}
                    >
                        {isLogoutLoading ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Email:</span> {user?.email}
                        </div>
                        {user?.name && (
                            <div>
                                <span className="font-medium">Name:</span> {user.name}
                            </div>
                        )}
                        <div>
                            <span className="font-medium">Role:</span> {user?.role}
                        </div>
                        <div>
                            <span className="font-medium">Email Verified:</span> {user?.isEmailVerified ? 'Yes' : 'No'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};