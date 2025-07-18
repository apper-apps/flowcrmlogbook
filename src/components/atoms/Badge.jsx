import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", size = "sm", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-500/20 text-gray-300 border-gray-500/20",
    primary: "bg-primary/20 text-primary border-primary/20",
    secondary: "bg-secondary/20 text-secondary border-secondary/20",
    success: "bg-success/20 text-success border-success/20",
    warning: "bg-warning/20 text-warning border-warning/20",
    error: "bg-error/20 text-error border-error/20",
    info: "bg-info/20 text-info border-info/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium border",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;