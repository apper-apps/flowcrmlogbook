import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, label, error, rows = 4, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full px-4 py-3 rounded-lg glass-dark border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 resize-none",
          error && "border-error focus:ring-error/50 focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;