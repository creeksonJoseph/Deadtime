import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function NetworkError({ error, onRetry, className = "" }) {
  return (
    <div className={`text-center max-w-md mx-auto px-4 ${className}`}>
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Connection Issue</h3>
      <p className="text-slate-300 mb-4">{error}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] px-6 py-2 rounded-lg font-semibold"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

export function InlineNetworkError({ error, className = "" }) {
  return (
    <div className={`p-3 bg-red-500/10 border border-red-500/30 rounded-lg ${className}`}>
      <div className="flex items-start gap-2">
        <ExternalLink className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-red-400 text-sm font-medium mb-1">Connection Issue</p>
          <p className="text-red-300 text-xs">{error}</p>
        </div>
      </div>
    </div>
  );
}