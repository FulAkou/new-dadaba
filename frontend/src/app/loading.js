import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold font-outfit text-secondary-900 tracking-tight">
          Préparation de vos délices...
        </h3>
        <p className="text-sm text-secondary-500 font-medium">
          L'excellence demande un court instant.
        </p>
      </div>
    </div>
  );
}
