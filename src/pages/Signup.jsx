import { X } from "lucide-react";

const Signup = ({ onClose }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Create an Account ✨
      </h2>

      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Signup
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <span className="text-blue-600 font-semibold cursor-pointer">
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
