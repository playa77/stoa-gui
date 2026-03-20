import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
  count?: number | null;
  pulse?: boolean;
}

const Badge = ({ variant = "info", count = null, pulse = false, className, children, ...props }: BadgeProps) => {
  const variants = {
    info: "bg-accent/10 text-accent ring-accent/20",
    warning: "bg-warning/10 text-warning ring-warning/20",
    error: "bg-error/10 text-error ring-error/20",
    success: "bg-success/10 text-success ring-success/20",
  };

  const formattedCount = count !== null && count > 99 ? "99+" : count;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        pulse && "animate-pulse",
        className
      )}
      {...props}
    >
      {count !== null ? (
        <span>{formattedCount}</span>
      ) : (
        <span className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-accent": variant === "info",
          "bg-warning": variant === "warning",
          "bg-error": variant === "error",
          "bg-success": variant === "success",
        })} />
      )}
      {children && <span className="ml-1.5">{children}</span>}
    </div>
  );
};

export { Badge };
