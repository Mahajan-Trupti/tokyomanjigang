import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navigation from "./components/Navigation";
import Background from "./components/Background";
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs";
import QuizPage from "./components/QuizPage";
import QuizResultsPage from "./components/QuizResultsPage";

const App = () => {
  return (
    <Router>
      <Background />
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/quiz" element={<QuizPage />} />{" "}
        <Route path="/quiz-results" element={<QuizResultsPage />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
