import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import {useAuth} from "../../hooks/useAuth"

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const{login}=useAuth();
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

async function handleSubmit(e) {
  e.preventDefault();
  try {
    await login(form);
  } catch (err) {
    alert(err.response?.data?.message || err.message || "Failed to sign in");
  }
}



  return (
  <>
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
      Welcome Back 👋
    </h2>
    <p className="text-center text-gray-500 mb-8">
      Sign in to continue
    </p>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300"
      >
        Sign In
      </button>
    </form>

    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-300"></div>
      <span className="px-3 text-gray-400 text-sm">OR</span>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>

    <GoogleButton></GoogleButton>
    <p className="text-center mt-6 text-sm text-gray-500">
      Don’t have an account?{" "}
      <Link
        to="/signup"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Sign Up
      </Link>
    </p>
  </>
);

}
