import React from "react";
import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";
import { Upload, Sparkles, FileText } from "lucide-react";

// All component logic is now defined within this file

// Component for the landing page's background
const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-slate-900"></div>

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Floating light orbs */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-40 right-1/3 w-40 h-40 bg-secondary/8 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/6 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Scanning lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/25 to-transparent
                        animate-pulse"
          style={{ top: "30%", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/15 to-transparent
                        animate-pulse"
          style={{ top: "70%", animationDuration: "4s", animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

// Component for the navigation bar
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
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
               hover-style-btn"
            >
              login
            </button>
          </Link>
          <Link to="/signup">
            <button
              className="px-5 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg
               text-foreground text-sm font-medium tracking-wide transition-all duration-300
               hover-style-btn"
            >
              signup
            </button>
          </Link>
          <Link to="/about-us">
            <button
              className="px-5 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg
               text-foreground text-sm font-medium tracking-wide transition-all duration-300
               hover-style-btn"
            >
              about us
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Component for the feature icons
const FeatureIcon = ({ type }) => {
  const iconConfig = {
    upload: {
      Icon: Upload,
      gradient: "from-primary to-primary/70",
      description: "Upload your PDF",
    },
    generate: {
      Icon: Sparkles,
      gradient: "from-secondary to-secondary/70",
      description: "AI Magic Generation",
    },
    export: {
      Icon: FileText,
      gradient: "from-primary/80 to-secondary/80",
      description: "Export & Learn",
    },
  };

  if (!iconConfig[type]) {
    console.error(`Invalid FeatureIcon type: ${type}`);
    return null;
  }

  const { Icon, gradient } = iconConfig[type];

  return (
    <div className="group cursor-pointer">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} 
                      flex items-center justify-center 
                      transition-all duration-300 
                      group-hover:scale-110 group-hover:rotate-12
                      shadow-lg group-hover:shadow-2xl
                      border border-white/10 group-hover:border-white/30`}
      >
        <Icon size={20} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
};

// The main LandingPage component that renders all sub-components
const LandingPage = () => {
  return (
    <>
      <Background />
      <Navigation />

      {/* Main container for a two-column layout */}
      <div className="grid grid-cols-[3fr_2fr] w-full min-h-screen">
        <main className="relative z-10 flex flex-col px-24 py-36 space-y-8 text-left h-fit">
          <div>
            <h1 className="text-4xl font-extrabold tracking-widest text-white glow-text font-spartan">
              SYNTHSIA:
            </h1>

            <p className="text-base text-muted-foreground mt-3 max-w-xl">
              Weave Knowledge into Questions.
            </p>

            <p className="text-base text-muted-foreground mt-3 max-w-xl italic">
              The AI-powered tool that transforms any PDF into a custom quiz for
              smarter learning.
            </p>
          </div>

          {/* Icons */}
          <div className="flex items-start gap-4">
            <FeatureIcon type="upload" />
            <FeatureIcon type="generate" />
            <FeatureIcon type="export" />
          </div>

          {/* CTA */}
          <Link to="/dashboard">
            <button className="magic-button text-white px-5 py-2.5 rounded-xl text-lg font-medium max-w-max">
              Start Weaving →
            </button>
          </Link>
        </main>

        {/* Spline Component as the right-hand column */}
        <div className="relative z-10 hidden h-full w-full lg:block">
          <Spline scene="https://prod.spline.design/LePaxKYClIH4s2y6/scene.splinecode" />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
