import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  outline: "border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )} 
      {...props} 
    />
  );
}
