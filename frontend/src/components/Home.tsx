import React, { useState } from "react";
import {
  Link2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Wand2,
  ArrowRight,
  Tag,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import Loading from "./Loading";

interface HomeProps {
  loggedIn?: boolean;
  isAuthLoading?: boolean;
}

export default function Home({ loggedIn = false, isAuthLoading = false }: HomeProps) {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const MAX_CHARS = 500;
  const MAX_SLUG_CHARS = 12;
  const isSlugOverLimit = customSlug.length > MAX_SLUG_CHARS;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > MAX_CHARS) {
      toast.error("Limit reached! Maximum 500 characters allowed.");
      return;
    }
    setLongUrl(val);
  };

  const mutation = useMutation({
    mutationFn: async (payload: { url: string; slug?: string }) => {
      const response = await api.post("/create", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setShortUrl(data.shortUrl);
      setLongUrl("");
      setCustomSlug("");
      setCopied(false);
      toast.success(data.message || "URL shortened successfully!");
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Failed to generate short URL. Try again!";
      toast.error(errorMsg);
    },
  });

  if (isAuthLoading) {
    return <Loading />;
  }

  const handleGenerate = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      toast.warning("Please enter a valid URL first!");
      return;
    }

    if (loggedIn && customSlug.trim().length > MAX_SLUG_CHARS) {
      toast.error(`Custom alias must be ${MAX_SLUG_CHARS} characters or fewer.`);
      return;
    }

    mutation.mutate({
      url: longUrl.trim(),
      ...(loggedIn && customSlug.trim() && { slug: customSlug.trim() }),
    });
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.info("Copied to clipboard!", { autoClose: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
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
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Long URL Input */}
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

          {/* Custom Short URL Section */}
          <div className="space-y-1.5">
            {!loggedIn && (
              <div className="flex items-center gap-1.5 px-1 text-xs text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  <Link
                    to="/auth"
                    className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors"
                  >
                    Login
                  </Link>{" "}
                  to create and save custom short URLs
                </span>
              </div>
            )}

            <div className="relative w-full group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none flex items-center justify-center ${
                  isSlugOverLimit
                    ? "text-rose-400"
                    : "text-zinc-500 group-focus-within:text-indigo-400"
                }`}
              >
                <Tag className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder={
                  loggedIn
                    ? "Custom alias (Optional, max 12 chars)... e.g. my-link"
                    : "Custom alias (Login required)"
                }
                disabled={mutation.isPending || !loggedIn}
                className={`w-full pl-12 pr-16 py-3.5 bg-zinc-950/80 border rounded-2xl text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed shadow-inner ${
                  isSlugOverLimit
                    ? "border-rose-500/80 text-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                    : "border-zinc-800/90 text-zinc-100 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />

              {loggedIn && (
                <span
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono transition-colors pointer-events-none ${
                    isSlugOverLimit
                      ? "text-rose-400 font-bold"
                      : customSlug.length >= 10
                        ? "text-amber-400"
                        : "text-zinc-500"
                  }`}
                >
                  {customSlug.length}/{MAX_SLUG_CHARS}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
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
