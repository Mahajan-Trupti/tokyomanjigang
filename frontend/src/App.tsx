// App.tsx
import React from "react";
import Background from "./components/Background";
import Navigation from "./components/Navigation";
import FeatureIcon from "./components/FeatureIcon";
import Spline from "@splinetool/react-spline";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Main application route - this is what you see at http://localhost:5173/ */}
          <Route
            path="/"
            element={
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
                        The AI-powered tool that transforms any PDF into a
                        custom quiz for smarter learning.
                      </p>
                    </div>
                    {/* Icons */}
                    <div className="flex items-start gap-4">
                      <FeatureIcon type="upload" />
                      <FeatureIcon type="generate" />
                      <FeatureIcon type="export" />
                    </div>
                    {/* CTA */}
                    <button className="magic-button text-white px-5 py-2.5 rounded-xl text-lg font-medium max-w-max">
                      Start Weaving →
                    </button>
                  </main>
                  {/* Spline Component as the right-hand column */}
                  <div className="relative z-10 hidden h-full w-full lg:block">
                    <Spline scene="https://prod.spline.design/LePaxKYClIH4s2y6/scene.splinecode" />
                  </div>
                </div>
              </>
            }
          />
          {/* Login and Signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
