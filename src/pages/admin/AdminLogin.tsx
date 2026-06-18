import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../lib/admin";
import ridelyLogo from "../assets/brand";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await adminLogin(password);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0f" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={ridelyLogo} alt="Ridely" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-[#a0a0b0] text-sm mt-1">Sign in to view analytics</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div>
            <label htmlFor="password" className="block text-sm text-[#a0a0b0] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a2e] border border-white/[0.08] text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff]"
              placeholder="Enter admin password"
              required
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="gradient-blue w-full py-2.5 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
