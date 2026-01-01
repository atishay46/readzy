import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Library, PlusCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/library', label: 'My Library', icon: Library },
    { to: '/currently-reading', label: 'Reading', icon: BookOpen },
    { to: '/add-book', label: 'Add Book', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-blue/30 bg-navy shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <BookOpen className="h-7 w-7 text-teal" />
            <span className="font-heading text-xl font-bold text-beige">
              Smart Shelf
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal/20 text-beige'
                      : 'text-sky-blue hover:bg-teal/10 hover:text-beige'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-sky-blue sm:block">
              Hello, <span className="font-medium text-beige">{user?.name}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sky-blue hover:bg-teal/20 hover:text-beige"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-3 md:hidden">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal/20 text-beige'
                    : 'text-sky-blue hover:bg-teal/10 hover:text-beige'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
