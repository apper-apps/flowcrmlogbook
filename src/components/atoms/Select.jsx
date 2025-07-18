import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ className, label, error, children, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-4 py-3 rounded-lg glass-dark border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200",
          error && "border-error focus:ring-error/50 focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;