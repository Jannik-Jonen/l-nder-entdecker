import { useState } from 'react';
import { Compass, User, LogIn, Sun, Moon, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from 'next-themes';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/inspiration', label: 'Inspiration' },
    { path: '/guides', label: 'Guides' },
    { path: '/blog', label: 'Blog' },
    { path: '/tipps', label: 'Reisetipps' },
    { path: '/profile', label: 'Meine Reisen' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold hidden xs:block">GlobeDetour</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
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
            
            {user ? null : (
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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Toggle
              aria-label="Theme umschalten"
              size="sm"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Toggle>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                      <Compass className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-display text-xl font-semibold">GlobeDetour</span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                    
                    <div className="my-2 border-t border-border/50" />
                    
                    {user ? null : (
                      <Button 
                        variant="ghost" 
                        className="justify-start px-4"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthDialogOpen(true);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Anmelden
                      </Button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
