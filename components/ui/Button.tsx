"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-[10px] border-none cursor-pointer select-none transition-all duration-300";

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-8 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  const variants = {
    primary: [
      "text-adoniz-pine",
      "bg-adoniz-fluorescent",
      "hover:-translate-y-0.5",
      "hover:bg-adoniz-yellow-ace",
      "hover:shadow-[0_8px_32px_rgba(240,255,61,0.35)]",
      "active:translate-y-0",
    ].join(" "),
    secondary: [
      "text-white",
      "bg-adoniz-neptune",
      "hover:-translate-y-0.5",
      "hover:bg-[#0e3650]",
      "hover:shadow-[0_8px_24px_rgba(17,66,93,0.3)]",
    ].join(" "),
    outline: [
      "text-adoniz-pine",
      "bg-transparent",
      "border border-adoniz-pine",
      "hover:bg-adoniz-pine",
      "hover:text-adoniz-snow",
      "hover:-translate-y-0.5",
    ].join(" "),
    ghost: [
      "text-adoniz-pine",
      "bg-transparent",
      "hover:text-adoniz-forest",
      "px-3 py-2",
    ].join(" "),
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={{ transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}
      {...props}
    >
      {children}
    </button>
  );
}
