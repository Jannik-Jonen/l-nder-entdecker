import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hasAuthParams =
      !!searchParams.get('code') ||
      !!searchParams.get('access_token') ||
      !!searchParams.get('refresh_token') ||
      !!searchParams.get('type') ||
      !!hashParams.get('access_token') ||
      !!hashParams.get('refresh_token') ||
      !!hashParams.get('type');
    if (hasAuthParams) {
      navigate(`/auth/callback${window.location.search}${window.location.hash}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
