import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
  const handleGoogleLogin = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    if (!serverUrl) {
      toast.error("VITE_SERVER_URL is not configured.");
      return;
    }

    const baseUrl = serverUrl.replace(/\/+$/, "");
    window.location.assign(`${baseUrl}/auth/google`);
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Background Grid Pattern & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-124 h-76 bg-linear-to-tr from-indigo-600/20 via-violet-600/15 to-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card Container */}
      <div className="w-full max-w-lg sm:max-w-xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 relative z-10 transition-all duration-300">
        {/* Dynamic Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-indigo-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Welcome to Shortify</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Get Started
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-500">
              .
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Sign in with your Google account to create custom short links and manage your URLs
            effortlessly.
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="space-y-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-indigo-500/50 text-white font-semibold text-base shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            {/* Google "G" Mark */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.85-.075-1.675-.215-2.475H12v4.685h6.445c-.28 1.495-1.125 2.765-2.395 3.615v3.01h3.875c2.265-2.085 3.565-5.16 3.565-8.835Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.955-1.075 7.94-2.91l-3.875-3.01c-1.075.72-2.45 1.15-4.065 1.15-3.125 0-5.77-2.11-6.715-4.945H1.28v3.105C3.255 21.31 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.285 14.285c-.24-.72-.38-1.49-.38-2.285s.14-1.565.38-2.285V6.61H1.28A11.984 11.984 0 0 0 0 12c0 1.935.465 3.765 1.28 5.39l4.005-3.105Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.605 4.585 1.795l3.435-3.435C17.95 1.19 15.235 0 12 0 7.31 0 3.255 2.69 1.28 6.61l4.005 3.105C6.23 6.88 8.875 4.77 12 4.77Z"
              />
            </svg>

            <span>Continue with Google</span>

            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
          </button>

          {/* Subtle Verification Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-indigo-400/80 shrink-0" />
            <span>Instant, verified sign-in — no password required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
