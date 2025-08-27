import React, { useState } from "react";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Decide endpoint based on email
    const endpoint =
      email === "admin@gmail.com"
        ? `${process.env.REACT_APP_API_URL}/auth/admin/login`
        : `${process.env.REACT_APP_API_URL}/auth/team/login`;

    const res = await axios.post(endpoint, {
      email,
      password,
    });

    // Save token + user in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login successful!");
    window.location.href = "/"; // redirect to homepage
  } catch (error: any) {
    alert(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
