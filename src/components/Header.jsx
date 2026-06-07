import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { toolCards } from "../tools/toolRegistry.jsx";

export function Header({ onNavigate, onTheme, isDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            onClick={() => navigate("home")}
          >
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </span>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Type <span className="text-blue-600">Scale</span>
            </h1>
          </button>
          <nav className="hidden lg:flex items-center space-x-2">
            {toolCards.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => navigate(tool.id)}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <tool.icon className="w-4 h-4" />
                <span>{tool.title}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={onTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>Theme</span>
            </button>
          </nav>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {mobileOpen && (
          <nav className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            {toolCards.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => navigate(tool.id)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <tool.icon className="w-5 h-5" />
                <span className="font-medium">{tool.title}</span>
              </button>
            ))}
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
            <button
              type="button"
              onClick={onTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
