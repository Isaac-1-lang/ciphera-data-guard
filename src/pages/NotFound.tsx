import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-accent/10 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-6xl lg:text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-xs lg:text-sm text-muted-foreground">
            Attempted to access: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
          
          <Button asChild className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
