import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Home,
  History,
  BookOpen,
  Leaf,
  X,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";

// --- API Base URL ---
const BASE_URL = "https://clg-plant-backend.vercel.app/api";

// ------------------- GEMINI API CALL -------------------
const sendUserIdToGemini = async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.warn("User not logged in");
    return;
  }

  try {
    const res = await fetch("https://your-gemini-api-url.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // if Gemini API requires token
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    console.log("Gemini API Response:", data);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
};

// ------------------- AUTH MODAL -------------------
const AuthModal = ({ onClose, setLoggedIn }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLoginView ? `${BASE_URL}/login` : `${BASE_URL}/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (data.token) {
        // ✅ Store token
        localStorage.setItem("token", data.token);

        // ✅ Store userId if provided
        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user.id);
        }

        // ✅ Send userId to Gemini API
        await sendUserIdToGemini();

        setLoggedIn(true);
        onClose();
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg mb-4">
              <Leaf size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoginView ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLoginView
                ? "Login to continue with AgriScan"
                : "Get started with agricultural insights"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:opacity-90"
            >
              {loading
                ? "Processing..."
                : isLoginView
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {/* Switch */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLoginView
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="font-semibold text-emerald-600 hover:underline ml-1"
              >
                {isLoginView ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------- HEADER -------------------
const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const menuItems = [
    { id: "home", path: "/home", label: "Home", icon: Home },
    { id: "camera", path: "/scanner", label: "AI Scanner", icon: Camera },
    { id: "history", path: "/history", label: "History", icon: History },
    { id: "learning", path: "/learning", label: "Learning Hub", icon: BookOpen },
  ];

  const handleMenuClick = (item, e) => {
    if (item.id === "camera" && !isLoggedIn) {
      e.preventDefault();
      setAuthOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent">
                AgriScan
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={(e) => handleMenuClick(item, e)}
                    className="group relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                      <Icon size={18} className="text-emerald-700" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-emerald-700">
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {!isLoggedIn ? (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Login / Signup
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white shadow-lg border-t">
            <div className="flex flex-col gap-2 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={(e) => handleMenuClick(item, e)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100"
                  >
                    <Icon size={18} className="text-emerald-700" />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </Link>
                );
              })}

              {!isLoggedIn ? (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Login / Signup
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} setLoggedIn={setLoggedIn} />
      )}
    </>
  );
};

export default Header;
