import React, { useState } from "react";
import { User, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signUpMutation = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string }) => {
      const response = await api.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully!");
      // Invalidate authUser query so App.tsx recognizes the new session cookie instantly
      navigate("/");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }, 300);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || "Failed to create account. Please try again.";
      toast.error(errorMsg);
    },
  });

  const handleSignUp = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warning("Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long.");
      return;
    }

    signUpMutation.mutate({ username, email, password });
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Username Field */}
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username..."
            disabled={signUpMutation.isPending}
            className="w-full pl-12 pr-4 py-4 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-50 shadow-inner"
          />
        </div>

        {/* Email Field */}
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            disabled={signUpMutation.isPending}
            className="w-full pl-12 pr-4 py-4 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-50 shadow-inner"
          />
        </div>

        {/* Password Field with Modern Toggle */}
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password..."
            disabled={signUpMutation.isPending}
            className="w-full pl-12 pr-12 py-4 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-50 shadow-inner"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <Eye className="w-5 h-5 text-indigo-400 transition-transform scale-110" />
            ) : (
              <EyeOff className="w-5 h-5 text-zinc-500 hover:text-zinc-300 transition-transform" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={signUpMutation.isPending}
          className={`group relative w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 overflow-hidden flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.99] ${
            signUpMutation.isPending
              ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700/50"
              : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 border border-indigo-400/30 hover:-translate-y-0.5"
          }`}
        >
          {signUpMutation.isPending ? (
            <span className="flex items-center gap-2.5 font-medium">
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </span>
          ) : (
            <>
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4 shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer bg-transparent border-none p-0 inline"
          >
            Sign in
          </button>
        ) : (
          <a
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </a>
        )}
      </div>
    </>
  );
}
