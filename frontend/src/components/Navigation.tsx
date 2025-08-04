import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo wrapped with Link component */}
        <Link to="/">
          <div className="text-xl font-bold tracking-wider glow-text cursor-pointer">
            synthsia
          </div>
        </Link>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <Link to="/login">
            <button
              className="px-5 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg
                         text-foreground text-sm font-medium tracking-wide transition-all duration-300
                         hover:border-primary hover:text-primary hover:shadow-pink-glow
                         hover:scale-105 opacity-0"
            >
              login
            </button>
          </Link>
          <Link to="/signup">
            <button
              className="px-5 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg
                         text-foreground text-sm font-medium tracking-wide transition-all duration-300
                         hover:border-primary hover:text-primary hover:shadow-pink-glow
                         hover:scale-105 opacity-0"
            >
              signup
            </button>
          </Link>
          <Link to="/about-us">
            <button
              className="px-5 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg
                           text-foreground text-sm font-medium tracking-wide transition-all duration-300
                           hover:border-primary hover:text-primary hover:shadow-pink-glow
                           hover:scale-105 opacity-0"
            >
              about us
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
