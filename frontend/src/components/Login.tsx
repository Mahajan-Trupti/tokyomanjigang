import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  auth,
  provider,
} from "../firebase"; // Assuming firebase.ts is in the parent directory of components

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in:", auth.currentUser?.email);
      navigate('/'); // Redirect to home page after successful login
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message); // Display Firebase error message
    }
  };

  const handleGoogleLogin = async () => {
    setError(null); // Clear previous errors
    try {
      await signInWithPopup(auth, provider);
      console.log("✅ Google login:", auth.currentUser?.email);
      navigate('/'); // Redirect to home page after successful Google login
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message); // Display Firebase error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl">
        <h2 className="text-3xl font-bold tracking-wider text-center text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            required
          />
          <button
            type="submit"
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
          >
            Login →
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
          >
            Login with Google
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p className="mt-6 text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline glow-text">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;