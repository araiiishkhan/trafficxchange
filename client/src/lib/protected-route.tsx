import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useState, useEffect } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        setIsAuthenticated(false);
      }
    }
    
    checkAuth();
  }, []);

  // Still loading
  if (isAuthenticated === null) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Authenticated
  return <Route path={path} component={Component} />;
}
