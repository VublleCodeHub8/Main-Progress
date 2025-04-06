import React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component for displaying status, counts, or labels
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant: "default", "outline", "success", "warning", "destructive", "info"
 * @param {string} props.size - Badge size: "sm", "md", "lg"
 * @param {boolean} props.rounded - Whether to apply rounded corners (default: true)
 * @returns {React.ReactElement} Badge component
 */
const Badge = ({
  className,
  children,
  variant = "default",
  size = "md",
  rounded = true,
  ...props
}) => {
  // Base styles for all badges
  const baseStyles = "inline-flex items-center font-medium";
  
  // Rounded styles
  const roundedStyles = rounded 
    ? "rounded-full" 
    : "rounded-md";
  
  // Size styles
  const sizeStyles = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "text-base px-2.5 py-1",
  };
  
  // Variant-specific styles
  const variantStyles = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  
  // Combine all styles
  const combinedClassName = cn(
    baseStyles,
    roundedStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );
  
  return (
    <span
      className={combinedClassName}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * BadgeGroup component for displaying multiple badges
 */
const BadgeGroup = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} {...props}>
      {children}
    </div>
  );
};

/**
 * BadgeDot component for displaying a colored dot
 */
const BadgeDot = ({ color = "gray", className, ...props }) => {
  const colorStyles = {
    gray: "bg-gray-400",
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  };
  
  return (
    <span 
      className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1", colorStyles[color], className)} 
      {...props} 
    />
  );
};

export { Badge, BadgeGroup, BadgeDot }; 