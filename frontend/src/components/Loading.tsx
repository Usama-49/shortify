import { useEffect, useState } from "react";

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
}

const COMET_DOTS = [
  { size: "w-3 h-3", color: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.85)]", delay: "0s" },
  { size: "w-2.5 h-2.5", color: "bg-indigo-400/80", delay: "0.09s" },
  { size: "w-2 h-2", color: "bg-violet-400/70", delay: "0.18s" },
  { size: "w-1.5 h-1.5", color: "bg-violet-400/55", delay: "0.27s" },
  { size: "w-1 h-1", color: "bg-indigo-300/40", delay: "0.36s" },
];

const COLD_START_MESSAGES = [
  "Waking up Shortify's server...",
  "Free-tier cold start in progress—hang tight!",
  "Spinning up link engine & database...",
  "Almost ready, preparing your workspace...",
];

export default function Loading({ label, fullScreen = false }: LoadingProps) {
  const [showStatus, setShowStatus] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      setShowStatus(true);
    }, 5000);

    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!showStatus) return;

    const cycleTimer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % COLD_START_MESSAGES.length);
    }, 3000);

    return () => window.clearInterval(cycleTimer);
  }, [showStatus]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 px-6 text-center text-zinc-400 select-none ${
        fullScreen ? "fixed inset-0 z-50 bg-zinc-950" : "flex-1 w-full min-h-[calc(100vh-8rem)]"
      }`}
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes cometSwing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes textRiseIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>

      {/* Ambient indigo/violet halo + comet spinner */}
      <div className="relative flex items-center justify-center p-2">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl pointer-events-none"
        />
        <div className="relative w-11 h-11">
          {COMET_DOTS.map((dot, idx) => (
            <span
              key={idx}
              className="absolute inset-0 flex justify-center"
              style={{
                animation: "cometSwing 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
                animationDelay: dot.delay,
              }}
            >
              <span className={`rounded-full ${dot.size} ${dot.color}`} />
            </span>
          ))}
        </div>
      </div>

      {label && (
        <span className="text-xs font-medium tracking-wider uppercase text-zinc-400">{label}</span>
      )}

      {/* Cold-start status card (appears after 3s) */}
      {showStatus && (
        <div
          className="w-full max-w-xs rounded-2xl border border-indigo-500/20 bg-zinc-900/80 backdrop-blur-md px-4 py-3 shadow-lg shadow-indigo-950/30"
          style={{ animation: "textRiseIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
            <p
              key={messageIndex}
              className="text-xs sm:text-sm font-medium text-indigo-100/90 tracking-wide"
              style={{ animation: "textRiseIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            >
              {COLD_START_MESSAGES[messageIndex]}
            </p>
          </div>

          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-indigo-500/15">
            <div
              className="h-full w-2/5 rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-violet-400"
              style={{ animation: "shimmerSweep 1.6s ease-in-out infinite" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
