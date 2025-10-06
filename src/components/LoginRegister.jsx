import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { User, Mail, Lock, LogIn, UserPlus, Building2, Sparkles } from "lucide-react";


const API_BASE = "https://employee-react.onrender.com/emp";

const loginUser = async (form) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: form.email, password: form.password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json();
};

const registerUser = async (form) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return await res.json();
};

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(form);
        const token = res.token || res.data?.token;
        if (!token) throw new Error("Token not received.");

      
        localStorage.setItem("token", token);

        setSuccess(true);

        
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        await registerUser(form);
        setSuccess(true);
        setTimeout(() => {
          alert("Registration successful! You can login now.");
          setIsLogin(true);
          setForm({ name: "", email: "", password: "" });
          setSuccess(false);
        }, 500);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 relative overflow-hidden">
    
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent mb-2">
            Employee Portal
          </h1>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Manage your workforce efficiently
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            className={`flex-1 text-center py-3 font-semibold rounded-lg transition-all duration-300 ${
              isLogin
                ? "bg-white text-purple-700 shadow-md"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => toggleMode(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </div>
          </button>
          <button
            type="button"
            className={`flex-1 text-center py-3 font-semibold rounded-lg transition-all duration-300 ${
              !isLogin
                ? "bg-white text-purple-700 shadow-md"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => toggleMode(false)}
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                required
              />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-pulse">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
              <p className="text-green-700 text-sm font-medium">Success! ✓</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? "Login" : "Create Account"}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => toggleMode(!isLogin)}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
