import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

type DataStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export function ThemedLoader({
  title = "Loading",
  message = "Fetching live data from the server.",
  className = "",
}: DataStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex min-h-48 items-center justify-center ${className}`}
    >
      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="absolute h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-900/70 shadow-lg shadow-cyan-500/20">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {title}
          </p>
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function NoDataState({
  title = "No data available",
  message = "Nothing has been published from the server yet.",
  className = "",
}: DataStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-slate-700/50 bg-slate-900/60 px-6 py-10 text-center shadow-lg shadow-cyan-500/5 ${className}`}
    >
      <p className="text-lg font-semibold text-slate-100">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{message}</p>
    </motion.div>
  );
}
