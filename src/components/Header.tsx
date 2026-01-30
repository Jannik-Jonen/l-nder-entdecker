import { useState } from 'react';
import { Compass, User, LogIn, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from 'next-themes';

export const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/inspiration', label: 'Inspiration' },
    { path: '/tipps', label: 'Reisetipps' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">GlobeDetour</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Toggle
              aria-label="Theme umschalten"
              className="ml-2"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Toggle>
            
            {user ? (
              <Link
                to="/profile"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                  location.pathname === '/profile'
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAuthDialogOpen(true)}
                className="ml-2"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                Anmelden
              </Button>
            )}
          </nav>
        </div>
      </header>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
