import { Link, useLocation } from "react-router-dom";
import { Code2, BookOpen, Trophy, LayoutDashboard, Sun, Moon, Brain, ShieldCheck } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/dashboard", label: "Dashboard", icon: Brain },
  { path: "/dsa", label: "DSA Sheet", icon: Code2 },
  { path: "/subjects", label: "Subjects", icon: BookOpen },
  { path: "/contests", label: "Contests", icon: Trophy },
  { path: "/admin", label: "Admin", icon: ShieldCheck },
];

const Navbar = () => {
  const location = useLocation();

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 TOGGLE THEME
  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 glow-purple">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight font-mono">
            Prep<span className="text-primary">Arena</span>
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary glow-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* USER */}
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm font-medium">👤 {user.name}</span>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90 ml-2"
            >
              Login
            </button>
          )}

          {/* 🌗 THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-secondary transition"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;