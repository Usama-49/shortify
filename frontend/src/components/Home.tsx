import React, { useState } from "react";
import { Link2, Sparkles, ExternalLink, Copy, Check, Wand2, ArrowRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query"; // Replaced useQuery with useMutation since creating a short URL is a POST operation

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  // Removed manual setIsGenerating state since useMutation provides mutation.isPending automatically
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const MAX_CHARS = 500;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val.length > MAX_CHARS) {
      toast.error("Limit reached! Maximum 500 characters allowed.");
      return;
    }

    setLongUrl(val);
  };
  // Added useMutation hook to handle the POST request, loading state, success toast, and error handling cleanly
  const mutation = useMutation({
    //* 1. Definition: mutationFn expects one parameter (urlToShorten)
    mutationFn: async (urlToShorten: string) => {
      const response = await axios.post("http://localhost:5000/api/create", {
        url: urlToShorten,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setShortUrl(data.shortUrl);
      toast.success("URL shortened successfully!");
    },
    onError: () => {
      toast.error("Failed to generate short URL. Try again!");
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      toast.warning("Please enter a valid URL first!");
      return;
    }
    //* 2. Execution: You pass longUrl here
    mutation.mutate(longUrl);
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.info("Copied to clipboard!", { autoClose: 2000 }); // overriding autoClose only for copy feedback
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Configure Global Defaults Here */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Background Grid Pattern & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-linear-to-tr from-indigo-600/20 via-violet-600/15 to-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card Container */}
      <div className="w-full max-w-lg sm:max-w-xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 relative z-10 transition-all duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-indigo-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Next-Gen URL Shortener</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Shortify
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-500">
              .
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Transform cluttered links into concise, trackable short URLs in milliseconds.
          </p>
        </div>

        {/* Shortener Form */}
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>

            <input
              type="url"
              value={longUrl}
              onChange={handleInputChange}
              placeholder="Paste your long link here..."
              disabled={mutation.isPending}
              className="w-full pl-12 pr-20 py-4 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-50 shadow-inner"
            />

            <span
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono transition-colors pointer-events-none ${
                longUrl.length >= 450 ? "text-amber-400 font-bold" : "text-zinc-500"
              }`}
            >
              {longUrl.length}/{MAX_CHARS}
            </span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`group relative w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 overflow-hidden flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.99] ${
              mutation.isPending
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700/50"
                : "bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 border border-indigo-400/30 hover:-translate-y-0.5"
            }`}
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2.5 font-medium">
                <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Generating Short Link...</span>
              </span>
            ) : (
              <>
                <Wand2 className="w-4 h-4 shrink-0" />
                <span>Shorten URL</span>
                <ArrowRight className="w-4 h-4 shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Generated URL Result Card */}
        {shortUrl && (
          <div className="mt-6 pt-6 border-t border-zinc-800/80 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800/90 shadow-inner">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-mono text-sm tracking-wide transition-colors duration-200 no-underline flex items-center gap-2 truncate group"
              >
                <span className="truncate">{shortUrl}</span>
                <ExternalLink className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700/80 active:scale-95 text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700/60 transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
