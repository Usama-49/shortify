import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";

interface AuthPageProps {
  defaultMode?: "login" | "signup";
}

export default function AuthPage({ defaultMode = "login" }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");

  // Keep state synced if routes like /login or /register are directly loaded or changed
  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode]);

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Background Grid Pattern & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[31rem] h-[19rem] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card Container */}
      <div className="w-full max-w-lg sm:max-w-xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 relative z-10 transition-all duration-300">
        {/* Dynamic Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-indigo-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{isLogin ? "Welcome Back" : "Get Started"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isLogin ? "Sign In" : "Create Account"}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              .
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            {isLogin
              ? "Enter your credentials to access your custom short links and account."
              : "Sign up to create custom short links and track your URLs effortlessly."}
          </p>
        </div>

        {/* Render Form based on active state */}
        {isLogin ? (
          <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
