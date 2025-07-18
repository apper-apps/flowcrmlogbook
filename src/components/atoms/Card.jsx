import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, hover = false, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "glass-dark rounded-xl p-6 shadow-xl border border-white/10",
        hover && "hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;