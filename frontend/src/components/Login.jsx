import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await api("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
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

        <form onSubmit={handleLogin}>
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

          {message ? <p role="alert" className="mb-3 text-sm text-red-400">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg
            bg-primary text-primary-foreground
            font-semibold
            hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30
            transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

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