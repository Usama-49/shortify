import { useState } from "react";
import { Link2, LogIn, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../api/api";
import ConfirmModal from "./ConfirmModal";

interface HeaderProps {
  loggedIn?: boolean;
  isAuthLoading?: boolean;
}

export default function Header({ loggedIn = false, isAuthLoading = false }: HeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully!");
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries({ queryKey: ["authUser"] });
      setConfirmLogoutOpen(false);
      navigate("/");
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Failed to log out. Please try again.";
      toast.error(errorMsg);
    },
  });

  const handleConfirmLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5 bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-800/50">
        {/* Compact Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight group no-underline"
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30 group-hover:scale-105 transition-transform">
            <Link2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Shortify
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-500">
              .
            </span>
          </span>
        </Link>

        {/* Action Navigation / Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthLoading ? (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 select-none"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
              <span>Checking session...</span>
            </div>
          ) : loggedIn ? (
            <>
              {/* Dashboard Button */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all no-underline shadow-sm active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(true)}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 border border-indigo-400/30 transition-all cursor-pointer active:scale-95 hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <ConfirmModal
        isOpen={confirmLogoutOpen}
        badgeText="Session"
        title="Log out of Shortify?"
        description="Do you want to continue with this action? You will need to sign in again to manage saved links or use custom slugs."
        confirmText="Continue & Logout"
        cancelText="Cancel"
        variant="danger"
        isLoading={logoutMutation.isPending}
        onCancel={() => {
          if (!logoutMutation.isPending) setConfirmLogoutOpen(false);
        }}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
