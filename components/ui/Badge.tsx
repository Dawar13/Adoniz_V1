import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "lime" | "pine" | "mist" | "new";
  className?: string;
}

export function Badge({ children, variant = "lime", className = "" }: BadgeProps) {
  const variants = {
    lime: "bg-adoniz-fluorescent text-adoniz-pine",
    pine: "bg-adoniz-pine text-adoniz-fluorescent",
    mist: "bg-adoniz-mist text-adoniz-forest border border-adoniz-distant-cloud",
    new: "bg-adoniz-fluorescent text-adoniz-pine text-[11px] font-bold rounded",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
