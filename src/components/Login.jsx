import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
    bg-background grid-bg">

      {/* 🔥 CARD */}
      <div className="w-full max-w-sm p-6 
      bg-card/80 backdrop-blur-xl 
      border border-border 
      rounded-2xl shadow-2xl glow-purple">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6 glow-text">
          Login to PrepArena
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 px-4 mb-3 rounded-lg 
          bg-background border border-input 
          text-foreground placeholder-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary 
          transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 px-4 mb-4 rounded-lg 
          bg-background border border-input 
          text-foreground placeholder-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary 
          transition"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full h-11 rounded-lg 
          bg-primary text-primary-foreground 
          font-semibold 
          hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30
          transition-all duration-300"
        >
          Log In
        </button>

        {/* Bottom */}
        <p className="text-sm text-center mt-4 text-muted-foreground">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;