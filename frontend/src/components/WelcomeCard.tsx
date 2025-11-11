import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const WelcomeCard = () => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Your minimal React 19 app is ready!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This is a minimal React application built with Vite, TypeScript, and Tailwind CSS.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
};