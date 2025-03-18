import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const Landing = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    navigate("/auth"); // Redirects to the Login Page
  };

  const handleSignup = () => {
    navigate("/auth"); // Redirects to the Signup Page
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-white text-center overflow-hidden"
      style={{
        background: "url('/background.png') no-repeat center center/cover",
      }}
    >
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Cloud IDE</h1>
      <p className="text-lg max-w-xl drop-shadow-md">
        A powerful, cloud-based development environment that allows you to
        write, test, and deploy code from anywhere.
      </p>
      <div className="mt-6">
        <button
          onClick={handleLogin}
          className="px-6 py-2 m-2 rounded-md bg-blue-600 text-white text-lg shadow-md hover:bg-blue-700"
        >
          Log In
        </button>
        <button
          onClick={handleSignup}
          className="px-6 py-2 m-2 rounded-md bg-orange-500 text-white text-lg shadow-md hover:bg-orange-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Landing;
