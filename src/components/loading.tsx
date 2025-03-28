import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  text?: string
  variant?: "primary" | "secondary" | "accent"
}

const LoadingVariants = {
  primary: "stroke-primary",
  secondary: "stroke-secondary",
  accent: "stroke-accent",
}

const LoadingSizes = {
  sm: "size-4",
  default: "size-8",
  lg: "size-12",
}

export function Loading({
  size = "default",
  text,
  variant = "primary",
  className,
  ...props
}: LoadingProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center gap-2 flex-col", className)}
      {...props}
    >
      <svg
        className={cn(
          "animate-spin",
          LoadingSizes[size],
          LoadingVariants[variant]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="text-sm text-foreground/80 animate-pulse">{text}</span>
      )}
    </div>
  )
}