import { X } from "lucide-react";

const Login = ({ onClose }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700">
        Welcome Back 👋
      </h2>

      <form className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="mt-2 bg-emerald-500 text-white font-semibold py-2 rounded-lg hover:bg-emerald-600 transition-all"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don’t have an account?{" "}
        <span className="text-emerald-600 font-semibold cursor-pointer">
          Signup
        </span>
      </p>
    </div>
  );
};

export default Login;
