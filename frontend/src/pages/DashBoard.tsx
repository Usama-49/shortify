import { useState } from "react";
import { Link2, Copy, Check, Trash2, LayoutDashboard, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import Loading from "../components/Loading";
import ConfirmModal from "../components/ConfirmModal";

interface SavedUrlItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  clicks: number;
  createdAt: string;
}

interface DashboardUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isUserVerified: boolean;
}

interface DashboardDataResponse {
  success: boolean;
  user: DashboardUser;
  urls: SavedUrlItem[];
}

interface DashBoardProps {
  loggedIn?: boolean;
}

interface PendingDeleteItem {
  id: string;
  slug: string;
  shortUrl: string;
}

export default function Dashboard({ loggedIn = false }: DashBoardProps) {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDeleteItem | null>(null);

  const { data, isPending, isError } = useQuery<DashboardDataResponse>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await api.get("/dashboard");
      return response.data;
    },
    enabled: loggedIn,
    staleTime: 1000 * 60 * 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string; slug: string }) => {
      const response = await api.delete(`/url/${id}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      toast.success(`Deleted custom link "${variables.slug}" successfully!`);
      setPendingDelete(null);
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Failed to delete short link.";
      toast.error(errorMsg);
    },
  });

  if (isPending) {
    return <Loading label="Loading dashboard" />;
  }

  if (isError || !data?.user) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 px-4 sm:px-8 py-28 max-w-4xl mx-auto flex flex-col items-center justify-center text-center font-sans">
        <h2 className="text-xl font-bold text-white">Unable to load dashboard</h2>
        <p className="text-zinc-400 text-sm mt-1 mb-6">
          Something went wrong while fetching your profile and links.
        </p>
        <button
          type="button"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["dashboardData"] })}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const { user, urls = [] } = data;
  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    user.username || "default",
  )}`;

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast.info("Copied to clipboard!", { autoClose: 2000 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate({ id: pendingDelete.id, slug: pendingDelete.slug });
  };

  const formatDate = (dateValue: string) => {
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return dateValue;
    return parsed.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 px-4 sm:px-8 py-28 max-w-6xl mx-auto flex flex-col font-sans">
      {/* User Profile Overview Banner */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.avatar || fallbackAvatar}
              alt={user.username}
              className="w-16 h-16 rounded-2xl bg-zinc-950 border border-indigo-500/30 p-1 shadow-inner object-cover"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-zinc-900 rounded-full ${
                user.isUserVerified ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              Welcome back, {user.username}! 👋
            </h2>
            <p className="text-zinc-400 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer no-underline w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Link</span>
        </Link>
      </div>

      {/* Dashboard Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-indigo-500/20 shadow-sm mb-3">
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span>User Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your Saved Links
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your custom aliases, track overall traffic, and clean up expired links.
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:border-zinc-700/85">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Links</p>
          <p className="text-2xl font-bold text-white mt-1">{urls.length}</p>
        </div>
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:border-zinc-700/85">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
            Total Clicks Tracked
          </p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {urls.reduce((acc, curr) => acc + curr.clicks, 0)}
          </p>
        </div>
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 shadow-lg transition-all duration-200 hover:border-zinc-700/85">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
            Account Status
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              user.isUserVerified ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {user.isUserVerified ? "Active / Verified" : "Unverified"}
          </p>
        </div>
      </div>

      {/* Links List Container */}
      {urls.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl">
          <Link2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No saved links found</h3>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto mt-1 mb-6">
            You haven&apos;t created or saved any custom short links yet. Get started by shortening
            your first URL!
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors no-underline"
          >
            Go to Shortener
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((item) => {
            const isDeletingThis = deleteMutation.isPending && pendingDelete?.id === item.id;

            return (
              <div
                key={item.id}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:border-zinc-700/80"
              >
                {/* URL Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-xs font-mono font-semibold">
                      /{item.slug}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Created on {formatDate(item.createdAt)}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {item.clicks} clicks
                    </span>
                  </div>

                  {/* Short URL Link */}
                  <div className="flex items-center gap-2">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-mono text-sm tracking-wide truncate no-underline flex items-center gap-1.5 group"
                    >
                      <span>{item.shortUrl}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>

                  {/* Original Destination URL */}
                  <p className="text-zinc-400 text-xs truncate max-w-2xl font-sans">
                    Target: <span className="text-zinc-300">{item.originalUrl}</span>
                  </p>
                </div>

                {/* Action Buttons (Copy & Delete) */}
                <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.shortUrl, item.id)}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700/80 active:scale-95 text-zinc-200 px-4 py-2.5 rounded-xl border border-zinc-700/60 transition-all cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        id: item.id,
                        slug: item.slug,
                        shortUrl: item.shortUrl,
                      })
                    }
                    disabled={isDeletingThis}
                    title="Delete short link"
                    className="flex items-center justify-center p-2.5 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/40 active:scale-95 text-rose-400 hover:text-rose-300 rounded-xl border border-rose-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        badgeText="Permanent Action"
        title="Delete short link?"
        description={
          <span>
            Do you want to continue with this action? This will permanently remove{" "}
            {pendingDelete?.slug ? (
              <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                /{pendingDelete.slug}
              </span>
            ) : (
              "this short link"
            )}{" "}
            and stop its redirect.
          </span>
        }
        confirmText="Continue & Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => {
          if (!deleteMutation.isPending) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
