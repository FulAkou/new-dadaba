import { cn } from "@/lib/utils/cn";
import React from "react";

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-secondary-200 bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 animate-fade-in">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
