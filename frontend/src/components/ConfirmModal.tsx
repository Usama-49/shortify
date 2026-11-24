import { useEffect, type ReactNode } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: ReactNode;
  badgeText?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description = "Do you want to continue with this action?",
  badgeText,
  confirmText = "Continue",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-md font-sans selection:bg-indigo-500 selection:text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={() => {
        if (!isLoading) onCancel();
      }}
    >
      <div
        className="relative w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800/90 hover:border-zinc-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/60 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4 pr-6">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
              isDanger
                ? "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-rose-500/10"
                : "bg-indigo-500/10 border-indigo-500/25 text-indigo-400 shadow-indigo-500/10"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            {badgeText && (
              <span
                className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-1.5 ${
                  isDanger
                    ? "text-rose-400/90 bg-rose-500/10 border-rose-500/20"
                    : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                }`}
              >
                {badgeText}
              </span>
            )}
            <h3 id="confirm-modal-title" className="text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Description (accepts string or JSX) */}
        <div className="text-sm text-zinc-400 leading-relaxed mb-6">{description}</div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-200 hover:text-white border border-zinc-700/70 hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white border shadow-lg transition-all cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
              isDanger
                ? "bg-rose-600/90 hover:bg-rose-500 border-rose-400/30 shadow-rose-600/20 hover:shadow-rose-500/35"
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border-indigo-400/30 shadow-indigo-500/20 hover:shadow-indigo-500/35"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            <span>{isLoading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
