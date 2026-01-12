import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Library,
  PlusCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";


const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/library", label: "My Library", icon: Library },
    { to: "/currently-reading", label: "Reading", icon: BookOpen },
    { to: "/add-book", label: "Add Book", icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-blue/30 bg-navy">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
          <img
              src="/readzy.png"
              alt="Readzy"
              className="h-12 w-12 object-contain"
            />

            <span className="text-2xl font-bold text-beige ">
              Readzy
            </span>
          </Link>

          <div className="hidden gap-1 md:flex">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
                    isActive
                      ? "bg-teal/20 text-beige"
                      : "text-sky-blue hover:bg-teal/10 hover:text-beige"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sky-blue">
              Hello, <span className="text-beige">{user?.name}</span>
            </span>
            <Button className="bg-accent-foreground" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
