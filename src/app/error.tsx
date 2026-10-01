"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 px-4 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Unable to load performance data</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We encountered an issue while trying to fetch the latest analytics. This might be due to a temporary database disruption or connectivity issue.
        </p>
      </div>
      <Button 
        onClick={() => reset()}
        className="mt-4 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Loading
      </Button>
    </div>
  );
}
