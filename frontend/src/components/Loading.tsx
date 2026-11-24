interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
}

const COMET_DOTS = [
  { size: "w-3 h-3", color: "bg-indigo-400", delay: "0s" },
  { size: "w-2.5 h-2.5", color: "bg-indigo-400/80", delay: "0.09s" },
  { size: "w-2 h-2", color: "bg-violet-400/70", delay: "0.18s" },
  { size: "w-1.5 h-1.5", color: "bg-violet-400/55", delay: "0.27s" },
  { size: "w-1 h-1", color: "bg-indigo-300/40", delay: "0.36s" },
];

export default function Loading({ label, fullScreen = false }: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 text-zinc-400 ${
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
      `}</style>

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

      {label && (
        <span className="text-xs font-medium tracking-wider uppercase text-zinc-500">{label}</span>
      )}
    </div>
  );
}
