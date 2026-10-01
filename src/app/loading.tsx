export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1464A5] rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading performance data...</p>
    </div>
  );
}
