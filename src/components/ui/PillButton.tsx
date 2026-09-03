import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "white";
  icon?: React.ReactNode;
}

export function PillButton({
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: PillButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      className={cn(
        "group relative inline-flex items-center gap-3 !h-12 rounded-full pl-6 pr-2 shadow-lg hover:scale-[1.02] transition-all overflow-hidden shrink-0 box-border py-0",
        isPrimary ? "bg-brand-primary" : "bg-white",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-0 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isPrimary ? "bg-white" : "bg-brand-primary",
        )}
      />
      <span className="relative z-10 text-sm font-bold text-brand-secondary">
        {children}
      </span>
      <span
        className={cn(
          "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
          isPrimary
            ? "bg-white group-hover:bg-brand-primary"
            : "bg-brand-primary group-hover:bg-white",
        )}
      >
        {icon ?? (
          <ArrowUpRight
            className={cn(
              "w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-45",
              isPrimary
                ? "text-brand-secondary"
                : "text-brand-secondary group-hover:text-black",
            )}
          />
        )}
      </span>
    </button>
  );
}
